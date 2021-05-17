import classes from "./CartItem.module.css";
import { Fragment, useEffect, useState, useContext } from "react";
import useHttpClient from "../../hooks/use-http";
import LoadingSpinner from "../../UI/LoadingSpinner";
import AuthContext from "../../context/auth-context";
const CartItem = (props) => {
  const auth = useContext(AuthContext);
  const [loadedBook, setLoadedBook] = useState();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  useEffect(() => {
    const getBookData = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/books/${props.id}`
        );
        setLoadedBook(responseData.book);
      } catch (err) {}
    };
    getBookData();
  }, [sendRequest]);

  const removeCartHandler = async () => {
    try{
        const responseData = await sendRequest(
            `${process.env.REACT_APP_BACKEND_URL}/cart/items/remove`,
            "POST",
            JSON.stringify({
              productId: props.id,
              userId: auth.userId,
            }),
            {
              "Content-Type": "application/json",
            }
          );
          console.log(responseData.items);
          props.updateCart(responseData.items,responseData.totalPrice);
        //   setLoadedBook(responseData.items);
        //   props.updateTotal(responseData.totalPrice);
        //   auth.cartCounter(responseData.items.length);

    }catch(err){

    }
  };

  return (
    <Fragment>
      {isLoading && <LoadingSpinner asOverlay></LoadingSpinner>}
      {!isLoading && loadedBook && (
        <li>
          <div className={classes.itemContainer}>
            <div className={classes.imageContainer}>
              <img src={`${process.env.REACT_APP_ASSET_URL}/${loadedBook.image}`}></img>
            </div>
            <div className={classes.detailsContainer}>
              <p className={classes.titleContainer}>{loadedBook.title}</p>
              <p>{`Price: ₹${loadedBook.price}`}</p>
              <button onClick={removeCartHandler}>Remove from Cart</button>
            </div>
          </div>
        </li>
      )}
    </Fragment>
  );
};
export default CartItem;
