import { Fragment, useEffect, useState } from "react";
import classes from "./Booklist.module.css";
import Bookitem from "./Bookitem";
import useHttpClient from "../../hooks/use-http";
import ErrorModal from "../../UI/ErrorModal";
import LoadingSpinner from "../../UI/LoadingSpinner";
const Booklist = (props) => {
  const [enteredFilter, setEnteredFilter] = useState("ALL");
  let bookItems = [];
  const [loadedBooks, setLoadedBooks] = useState(null);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  useEffect(() => {
    const getBooks = async () => {
      try {
        const responseData = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/books`);
        setLoadedBooks(responseData.books);
        console.log(responseData.books);
      } catch (err) {}
    };
    getBooks();
  }, [sendRequest]);
  if(enteredFilter==='ALL'){
  bookItems =
    !isLoading &&
    loadedBooks &&
    loadedBooks.map((book) => (
      <Bookitem
        key={book.id}
        id={book.id}
        title={book.title}
        imageSrc={book.image}
        price={book.price}
      ></Bookitem>
    ));
  }
  else{
      const filteredBooks=!isLoading&&loadedBooks&& loadedBooks.filter((book)=>{return book.branch===enteredFilter});
      bookItems = !isLoading&&loadedBooks&& filteredBooks.map((book) => (
        <Bookitem
          key={book.id}
          id={book.id}
          title={book.title}
          imageSrc={book.image}
          price={book.price}
        ></Bookitem>
      ))
  }

  const filterChangedHandler = (event) => {
    console.log(event.target.value);
    setEnteredFilter(event.target.value);
  };

  return (
    <Fragment>
      <ErrorModal error={error} onClear={clearError}></ErrorModal>
      {isLoading&&<div className={classes.loading}>
            <LoadingSpinner asOverlay></LoadingSpinner>
            <h2>Please Wait!</h2>
            </div>}
      <div className={classes.bookList}>
        {isLoading && (
          <div className={classes.centered}>
          </div>
        )}
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
        {!isLoading&&loadedBooks&&loadedBooks.length>0 && <ul className={classes.booksContainer}>
          {bookItems}
        </ul>}
      </div>
    </Fragment>
  );
};
export default Booklist;
