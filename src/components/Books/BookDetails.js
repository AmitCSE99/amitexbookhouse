import { useHistory, useParams } from "react-router-dom";
import classes from "./BookDetail.module.css";
import { Fragment, useEffect, useState, useContext } from "react";
import useHttpClient from "../../hooks/use-http";
import ErrorModal from "../../UI/ErrorModal";
import AuthContext from "../../context/auth-context";
import LoadingSpinner from "../../UI/LoadingSpinner";
const BookDetails = (props) => {
  const history = useHistory();
  const auth = useContext(AuthContext);
  const params = useParams();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  // const bookDetail = DUMMY_BOOKS.filter((book) => {
  //   return book.id === params.bookId;
  // });
  const [loadedBook, setLoadedBook] = useState();
  useEffect(() => {
    const getBook = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/books/${params.bookId}`
        );
        setLoadedBook(responseData.book);
      } catch (err) {}
    };
    getBook();
  }, [sendRequest]);

  const addToCartHandler = async () => {
    if (!auth.isLoggedIn) {
      history.push("/login");
    } else {
      console.log(auth.cartItemCount);
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/cart/addToCart`,
          "PATCH",
          JSON.stringify({
            userId: auth.userId,
            productId: params.bookId,
            item: {
              productId: params.bookId,
              quantity: 1,
              productPrice: loadedBook.price,
            },
          }),
          {
            "Content-Type": "application/json",
            Authorization: "Bearer " + auth.token,
          }
        );

        try {
          const responseData = await sendRequest(
            `${process.env.REACT_APP_BACKEND_URL}/auth/getUser/${auth.userId}`
          );
          auth.cartCounter(responseData.user.cart.items.length);
        } catch (err) {}
      } catch (err) {}
    }
  };

  return (
    <Fragment>
      <ErrorModal error={error} onClear={clearError}></ErrorModal>
      {isLoading&&<LoadingSpinner asOverlay></LoadingSpinner>}
      <div className={classes.detailContainer}>
        {!isLoading && loadedBook && (
          <div className={classes.imageContainer}>
            <img src={loadedBook.image}></img>
          </div>
        )}
        {!isLoading && loadedBook && (
          <div className={classes.descriptionContainer}>
            <h2>{loadedBook.title}</h2>
            <p className={classes.priceTag}>{`Price: ₹${loadedBook.price}`}</p>
            {loadedBook.stockQuantity>8&& <p className={classes.stockTag}>In stock</p>}
            {loadedBook.stockQuantity<=8&&<p className={classes.stockTag}>{`Only ${loadedBook.stockQuantity} books left!`}</p>}
            <button className={classes.descriptionButton} onClick={addToCartHandler}>Add To Cart</button>
            <h2 className={classes.descriptionHeader}>About The Book</h2>
            <p className={classes.descriptionPara}>{loadedBook.description}</p>
          </div>
        )}
      </div>
    </Fragment>
  );
};
export default BookDetails;
