import useInput from "../../hooks/use-input";
import classes from "./EditProduct.module.css";
import { useState, useEffect, Fragment, useCallback } from "react";
import React from "react";
import { useHistory, useParams } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../../context/auth-context";
import LoadingSpinner from "../../UI/LoadingSpinner";
import ErrorModal from "../../UI/ErrorModal";
import useHttpClient from "../../hooks/use-http";
import ImageUpload from "../../UI/ImageUpload";
let initialTitle;
let initialPrice;
let initialImage;
let initialDescription;
let initialQuantity;
const EditProduct = (props) => {
    // const [initialTitle,setInitialTitle]=useState('');
    // const [initialAddress,setInitialAddress]=useState('');
    

  const history = useHistory();
  const auth = useContext(AuthContext);
  const params = useParams();
  const [loadedBook, setLoadedBook] = useState();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  
  
  const titleValidator = (value) => {
    return value.trim() != "";
  };

  const descriptionValidator = (value) => {
    return value.trim() != "" && value.length >= 5;
  };
  const imageValidator = (value) => {
    if(!value){
      return false;
    }
    return value.name.trim()!='';
  };

  const priceValidator = (value) => {
    return value.length > 0;
  };

  const addressValidator = (value) => {
    return value.trim() != "";
  };

  const [formIsValid, setFormIsValid] = useState(false);
  const {
    value: enteredTitle,
    isValid: enteredTitleIsValid,
    hasError: titleInputHasError,
    valueChangeHandler: titleChangedHandler,
    inputBlurHandler: titleBlurHandler,
    reset: resetTitleInput,
    setData:setTitleData
  } = useInput(titleValidator);

  const {
    value: enteredDescription,
    isValid: enteredDescriptionIsValid,
    hasError: descriptionInputHasError,
    valueChangeHandler: descriptionChangedHandler,
    inputBlurHandler: descriptionBlurHandler,
    setData:setDescriptionData,
    reset: resetDescriptionInput,
  } = useInput(descriptionValidator,initialDescription);

  const {
    value: enteredImage,
    isValid: enteredImageIsValid,
    hasError: imageInputHasError,
    valueChangeHandler: imageChangedHandler,
    inputBlurHandler: imageBlurHandler,
    inputHandler:imageInputHandler,
    setData:setImageData,
    reset: resetInputInput,
  } = useInput(imageValidator,initialImage);

  const {
    value: enteredPrice,
    isValid: enteredPriceIsValid,
    hasError: priceInputHasError,
    valueChangeHandler: priceChangedHandler,
    inputBlurHandler: priceBlurHandler,
    setData:setPriceData,
    reset: resetPriceInput,
  } = useInput(priceValidator,initialPrice);

  const {
    value: enteredQuantity,
    isValid: enteredQuantityIsValid,
    hasError: quantityInputHasError,
    valueChangeHandler: quantityChangedHandler,
    inputBlurHandler: quantityBlurHandler,
    setData:setQuantityData,
    reset: resetQuantityInput,
  } = useInput(priceValidator,initialQuantity);


  const ac = new AbortController();
  const bc=new AbortController();
  const [filter,setFilter]=useState();

  useEffect(() => {
    const getBook = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/books/${params.bookId}`
        );
        setLoadedBook(responseData.book);
        // initialTitle=responseData.book.title;
        setTitleData(responseData.book.title);
        // initialImage=responseData.book.image;
        // setImageData(responseData.book.image);
        // initialPrice=responseData.book.price;
        setPriceData(responseData.book.price)
        // initialDescription=responseData.book.description;
        setDescriptionData(responseData.book.description)
        setQuantityData(responseData.book.stockQuantity);
        setFilter(responseData.book.branch);
        // initialAddress=responseData.book.address;
        setAddressData(responseData.book.address)
        console.log(initialTitle);
        setFormIsValid(true);
      } catch (err) {}
    };
    getBook();
    return ()=>bc.abort();
  }, [sendRequest, params.bookId,setFormIsValid]);
  
  

  useEffect(() => {
    if (
      enteredTitleIsValid &&
      enteredPriceIsValid &&
      enteredDescriptionIsValid &&
      enteredQuantityIsValid
    ) {
      setFormIsValid(true);
    } else {
      setFormIsValid(false);
    }

    return () => ac.abort();
  }, [
    enteredTitleIsValid,
    enteredPriceIsValid,
    enteredDescriptionIsValid,
    enteredQuantityIsValid,
  ]);

  const addProductHandler = async (event) => {
    event.preventDefault();
    if (
      !enteredTitleIsValid &&
      !enteredQuantityIsValid &&
      !enteredDescriptionIsValid &&
      !enteredPriceIsValid
    ) {
      return;
    }
    try {
      const responseData = await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/books/${params.bookId}`,
        'PATCH',
        JSON.stringify({
          title: enteredTitle,
          price: enteredPrice,
          description: enteredDescription,
          stockQuantity:enteredQuantity,
          filter,
          createdBy: auth.userId,
        }),
        { "Content-Type": "application/json",Authorization:'Bearer '+auth.token}
      );
      history.replace("/user-products");
    } catch (err) {
      console.log(err);
    }
  };

  const filterChangedHandler=(event)=>{
    setFilter(event.target.value);
  }


  return (
    <Fragment>
      <ErrorModal error={error} onClear={clearError}></ErrorModal>
      <div className={classes.contactFormContainer}>
        {isLoading && <LoadingSpinner asOverlay={true}></LoadingSpinner>}
        {!isLoading&&loadedBook&& <form onSubmit={addProductHandler}>
          <div className={classes.contactForm}>
            <h2>Edit Book</h2>
            <label htmlFor="title">Title</label>
            <input
                type="text"
                id="title"
                onChange={titleChangedHandler}
                value={enteredTitle}
                // ref={loadedBook.title}
                onBlur={titleBlurHandler}
              ></input>
            {titleInputHasError && (
              <p className={classes.errorText}>title cannot be empty</p>
            )}
            <label htmlFor="Price">Price</label>
            {!isLoading&&loadedBook&& <input
              id="price"
              type="number"
              onChange={priceChangedHandler}
              value={enteredPrice}
              onBlur={priceBlurHandler}
            ></input>}
            {priceInputHasError && (
              <p className={classes.errorText}>Price can't be empty</p>
            )}
            {/* <label type="image">Image URL</label>
            <input
              id="image"
              type="text"
              onChange={imageChangedHandler}
              value={enteredImage}
              onBlur={imageBlurHandler}
            ></input>
            {imageInputHasError && (
              <p className={classes.errorText}>Invalid Image Url!</p>
            )} */}
            {/* <ImageUpload id="image" onInput={imageInputHandler}></ImageUpload> */}
            <div className={classes.dropDown}>
          <label htmlFor="branchSelection">Filter by Branch</label>
          <select name="branch" id="branch" value={filter} onChange={filterChangedHandler}>
            <option value="ALL">ALL</option>
            <option value="CSE">COMPUTER SCIENCE</option>
            <option value="ECE">ELECTRONICS</option>
            <option value="CE">CIVIL</option>
            <option value="ME">MECHANICAL</option>
          </select>
        </div>
            <label id="Stock Quantity">Address</label>
            <input
              id="stockQuantity"
              type="number"
              value={enteredQuantity}
              onChange={quantityChangedHandler}
              onBlur={quantityBlurHandler}
            ></input>
            {quantityInputHasError && (
              <p className={classes.errorText}>Stock can't be empty</p>
            )}
            <label id="description">Description</label>
            <input
              id="description"
              type="text"
              value={enteredDescription}
              onChange={descriptionChangedHandler}
              onBlur={descriptionBlurHandler}
            ></input>
            {descriptionInputHasError && (
              <p className={classes.errorText}>Address can't be empty</p>
            )}
            <div className={classes.buttonContainer}>
              <button>Edit Your Book</button>
            </div>
          </div>
        </form>}
      </div>
    </Fragment>
  );
};
export default EditProduct;
