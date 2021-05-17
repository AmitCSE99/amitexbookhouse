import useInput from "../../hooks/use-input";
import classes from './AddAddress.module.css';
import { useState, useEffect } from "react";
import React from "react";
import { useContext } from "react";
import AuthContext from "../../context/auth-context";
import LoadingSpinner from "../../UI/LoadingSpinner";
import ErrorModal from "../../UI/ErrorModal";
import useHttpClient from "../../hooks/use-http";
const EditAddress = (props) => {
  const auth = useContext(AuthContext);
  const addressValidator = (value) => {
    return value.length > 5;
  };
  const [formIsValid, setFormIsValid] = useState(false);
  const {
    value: enteredAddress,
    isValid: enteredAddressIsValid,
    hasError: addressInputHasError,
    valueChangeHandler: addressChangedHandler,
    inputBlurHandler: addressBlurHandler,
    setData: setAddress,
  } = useInput(addressValidator);

  const ac = new AbortController();

  useEffect(() => {
    if (
      enteredAddressIsValid
    ) {
      setFormIsValid(true);
    } else {
      setFormIsValid(false);
    }
    return () => ac.abort();
  }, [
    enteredAddressIsValid
  ]);
  const {isLoading,error,sendRequest,clearError}=useHttpClient();
  const closeBackdropHandler = () => {
    history.replace("/");
  };
  const formSubmitHandler=async(event)=>{
    event.preventDefault();
    if(!enteredAddressIsValid){
      return;
    }
    try{
      const responseData=await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/auth/new-address`,'PATCH',JSON.stringify({
        userId:auth.userId,
        enteredAddress:enteredAddress
      }),{
        "Content-Type": "application/json",Authorization:'Bearer '+auth.token
      });
      history.back();
    }catch(err){

    }

  }

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError}></ErrorModal>
  <div className={classes.contactFormContainer}>
    {isLoading&&<LoadingSpinner asOverlay></LoadingSpinner>}
      <form onSubmit={formSubmitHandler}>
        <div className={classes.contactForm}>
          <h2>Add Address</h2>
          <label htmlFor="address">New Address</label>
            <textarea
              type="text"
              id="address"
              rows="4"
              cols="4"
              onChange={addressChangedHandler}
              value={enteredAddress}
              onBlur={addressBlurHandler}
            ></textarea>
          
          {addressInputHasError && (
            <p className={classes.errorText}>Address cannot be empty</p>
          )}
          
          
          <div className={classes.buttonContainer}>
            <button onClick={closeBackdropHandler}>Close</button>
            <button disabled={!formIsValid}>Submit</button>
          </div>
        </div>
      </form>
  </div>
  </React.Fragment>
  );
};
export default EditAddress;
