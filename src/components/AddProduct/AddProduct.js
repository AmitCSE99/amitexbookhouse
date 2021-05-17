import useInput from "../../hooks/use-input";
import classes from "./AddProduct.module.css";
import { useState, useEffect, Fragment } from "react";
import React from "react";
import { useHistory } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../../context/auth-context";
import LoadingSpinner from "../../UI/LoadingSpinner";
import ErrorModal from "../../UI/ErrorModal";
import useHttpClient from '../../hooks/use-http';
import ImageUpload from "../../UI/ImageUpload";
const AddProduct = (props) => {
  const history=useHistory();
  const auth = useContext(AuthContext);
  const {isLoading,error,sendRequest,clearError}=useHttpClient();
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
    return value.length >0;
  };

  const quantityValidator=(value)=>{
    return value.length>0;
  }


  const [isSignup, setIsSignup] = useState(false);
  const [formIsValid, setFormIsValid] = useState(false);
  const {
    value: enteredTitle,
    isValid: enteredTitleIsValid,
    hasError: titleInputHasError,
    valueChangeHandler: titleChangedHandler,
    inputBlurHandler: titleBlurHandler,
    reset: resetTitleInput,
  } = useInput(titleValidator);

  const {
    value: enteredDescription,
    isValid: enteredDescriptionIsValid,
    hasError: descriptionInputHasError,
    valueChangeHandler: descriptionChangedHandler,
    inputBlurHandler: descriptionBlurHandler,
    reset: resetDescriptionInput,
  } = useInput(descriptionValidator);

  const {
    value: enteredImage,
    isValid: enteredImageIsValid,
    hasError: imageInputHasError,
    valueChangeHandler: imageChangedHandler,
    inputBlurHandler: imageBlurHandler,
    inputHandler:imageInputHandler,
    reset: resetInputInput,
  } = useInput(imageValidator);

  const {
    value: enteredPrice,
    isValid: enteredPriceIsValid,
    hasError: priceInputHasError,
    valueChangeHandler: priceChangedHandler,
    inputBlurHandler: priceBlurHandler,
    reset: resetPriceInput,
  } = useInput(priceValidator);

  const {
    value: enteredQuantity,
    isValid: enteredQuantityIsValid,
    hasError: quantityInputHasError,
    valueChangeHandler: quantityChangedHandler,
    inputBlurHandler: quantityBlurHandler,
    reset: resetQuantityInput,
  } = useInput(quantityValidator);


  const ac = new AbortController();

  console.log(enteredImage);

  useEffect(() => {
    if (
      enteredTitleIsValid &&
      enteredPriceIsValid &&
      enteredDescriptionIsValid &&
      enteredImageIsValid&&
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
    enteredImageIsValid,
    enteredDescriptionIsValid,
    enteredQuantityIsValid
  ]);

  const addProductHandler=async(event)=>{
    event.preventDefault();
    if(!enteredTitleIsValid && !enteredQuantityIsValid && !enteredDescriptionIsValid&&!enteredImageIsValid&&!enteredPriceIsValid){
      return;
    }
    try{
      const formData= new FormData();
      formData.append('title',enteredTitle);
      formData.append('price',enteredPrice);
      formData.append('description',enteredDescription);
      formData.append('stockQuantity',enteredQuantity);
      formData.append('filter',filter);
      formData.append('createdBy',auth.userId);
      formData.append('image',enteredImage);
      const responseData=await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/books/new-book`,"POST",formData,{
        Authorization:'Bearer '+auth.token
      })
      history.replace('/');
    }catch(err){
      console.log(err);
    }

  }

  const [filter,setFilter]=useState();
  const filterChangedHandler=(event)=>{
    setFilter(event.target.value);
  }

  


  return <Fragment>
    <ErrorModal error={error} onClear={clearError}></ErrorModal>
    <div className={classes.contactFormContainer}>
  {isLoading&&<LoadingSpinner asOverlay={true}></LoadingSpinner>}
    <form onSubmit={addProductHandler}>
      <div className={classes.contactForm}>
        <h2>Add Book</h2>
        <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            onChange={titleChangedHandler}
            value={enteredTitle}
            onBlur={titleBlurHandler}
          ></input>
        {titleInputHasError && (
          <p className={classes.errorText}>title cannot be empty</p>
        )}
        <label htmlFor="Price">Price</label>
        <input
          id="price"
          type="number"
          onChange={priceChangedHandler}
          value={enteredPrice}
          onBlur={priceBlurHandler}
        ></input>
        {priceInputHasError && (
          <p className={classes.errorText}>
            Price can't be empty
          </p>
        )}
        <ImageUpload id="image" onInput={imageInputHandler}></ImageUpload>
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
        <label id="stockQuantity">Address</label>
          <input
            id="stockQuantity"
            type="number"
            value={enteredQuantity}
            onChange={quantityChangedHandler}
            onBlur={quantityBlurHandler}
          ></input>
        {quantityInputHasError && (
          <p className={classes.errorText}>
            Stock can't be empty!
          </p>
        )}
        <label id="description">Description</label>
          <input
            id="description"
            type="text"
            value={enteredDescription}
            onChange={descriptionChangedHandler}
            onBlur={descriptionBlurHandler}
          ></input>
        {descriptionInputHasError&&(<p className={classes.errorText}>Please add some description!</p>)}
        <div className={classes.buttonContainer}>
          <button disabled={!formIsValid}>Add Your Book</button>
        </div>
      </div>
    </form>
</div>
</Fragment>
};
export default AddProduct;
