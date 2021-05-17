import { useEffect, useState,useContext, Fragment } from "react";
import classes from "./UserProduct.module.css";
import UserProductItem from "./UserProductItem";
import useHttpClient from "../../hooks/use-http";
import AuthContext from "../../context/auth-context";
import ErrorModal from "../../UI/ErrorModal";
import LoadingSpinner from "../../UI/LoadingSpinner";

const UserProducts = (props) => {
  const auth=useContext(AuthContext);
  const [enteredFilter, setEnteredFilter] = useState("ALL");
  const [userBooks,setUserBooks]=useState();
  let bookItems = [];
  const {isLoading,error,sendRequest,clearError}=useHttpClient();
  useEffect(()=>{
    const fetchUserBooks=async()=>{
      try{
        const responseData=await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/books`);
      setUserBooks(responseData.books);
      }catch(err){

      }

    }
    fetchUserBooks();
  },[sendRequest,auth.userId])

  if(enteredFilter==='ALL'){
    bookItems =
      !isLoading &&
      userBooks &&
      userBooks.map((book) => (
        <UserProductItem
          key={book.id}
          id={book.id}
          title={book.title}
          imageSrc={book.image}
          price={book.price}
        ></UserProductItem>
      ));
    }
    else{
        const filteredBooks=!isLoading&&userBooks&& userBooks.filter((book)=>{return book.branch===enteredFilter});
        bookItems = !isLoading&&userBooks&& filteredBooks.map((book) => (
          <UserProductItem
            key={book.id}
            id={book.id}
            title={book.title}
            imageSrc={book.image}
            price={book.price}
          ></UserProductItem>
        ))
    }

  const filterChangedHandler = (event) => {
    console.log(event.target.value);
    setEnteredFilter(event.target.value);
  };

  return (
    <Fragment>
      <ErrorModal error={error} onClear={clearError}></ErrorModal>
      {isLoading&&<div className={classes.centered}>
          <div className={classes.loading}>
            <LoadingSpinner></LoadingSpinner>
            <h2>Please Wait</h2>
          </div>
        </div>}
    <div className={classes.bookList}>
      <div className={classes.dropDown}>
        <label htmlFor="branchSelection">Filter by Branch</label>
        <select name="branch" id="branch" onChange={filterChangedHandler}>
          <option value="ALL">ALL</option>
          <option value="CSE">COMPUTER SCIENCE</option>
          <option value="ECE">ELECTRONICS</option>
          <option value="CE">CIVIL</option>
          <option value="ME">MECHANICAL</option>
        </select>
      </div>
      {!isLoading&&userBooks&&userBooks.length>0&& <ul className={classes.booksContainer}>{bookItems}</ul>}
      {!isLoading&&userBooks&&userBooks.length===0&&<p>No books are added by you</p>}
    </div>
    </Fragment>
  );
};
export default UserProducts;
