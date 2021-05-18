import useInput from "../../hooks/use-input";
import classes from "./Login.module.css";
import { useState, useEffect} from "react";
import React from 'react'
import { useHistory } from "react-router-dom";
import {useContext} from 'react';
import AuthContext from '../../context/auth-context';
import LoadingSpinner from '../../UI/LoadingSpinner';
import ErrorModal from "../../UI/ErrorModal";
import useHttpClient from '../../hooks/use-http';
const Login = (props) => {
  const auth=useContext(AuthContext);
  const nameValidator = (value) => {
    return value.trim() != "";
  };

  const emailValidator = (value) => {
    return value.trim() != "" && value.includes("@");
  };

  const passwordValidator = (value) => {
    return value.length > 5;
  };

  const numberValidator = (value) => {
    return value.length === 10;
  };

  const addressValidator = (value) => {
    return value.trim() != "";
  };

  const [isSignup, setIsSignup] = useState(false);
  const [formIsValid, setFormIsValid] = useState(false);
  const {
    value: enteredName,
    isValid: enteredNameIsValid,
    hasError: nameInputHasError,
    valueChangeHandler: nameChangedHandler,
    inputBlurHandler: nameBlurHandler,
    reset: resetNameInput,
  } = useInput(nameValidator);

  const {
    value: enteredEmail,
    isValid: enteredEmailIsValid,
    hasError: emailInputHasError,
    valueChangeHandler: emailChangedHandler,
    inputBlurHandler: emailBlurHandler,
    reset: resetEmailInput,
  } = useInput(emailValidator);

  const {
    value: enteredPassword,
    isValid: enteredPasswordIsValid,
    hasError: passwordInputHasError,
    valueChangeHandler: passwordChangedHandler,
    inputBlurHandler: passwordBlurHandler,
    reset: resetPasswordInput,
  } = useInput(passwordValidator);

  const {
    value: enteredNumber,
    isValid: enteredNumberIsValid,
    hasError: numberInputHasError,
    valueChangeHandler: numberChangedHandler,
    inputBlurHandler: numberBlurHandler,
    reset: resetNumberInput,
  } = useInput(numberValidator);

  const {
    value: enteredAddress,
    isValid: enteredAddressIsValid,
    hasError: addressInputHasError,
    valueChangeHandler: addressChangedHandler,
    inputBlurHandler: addressBlurHandler,
    reset: resetAddressInput,
  } = useInput(addressValidator);

  const ac=new AbortController();

  useEffect(() => {
    if (isSignup) {
      if (
        enteredNameIsValid &&
        enteredEmailIsValid &&
        enteredPasswordIsValid &&
        enteredNumberIsValid&&enteredAddressIsValid
      ) {
        setFormIsValid(true);
      } else {
        setFormIsValid(false);
      }
    } else {
      if (enteredEmailIsValid && enteredPasswordIsValid) {
        setFormIsValid(true);
      } else {
        setFormIsValid(false);
      }
    }
    return ()=>ac.abort();
    
  }, [
    enteredEmailIsValid,
    enteredPasswordIsValid,
    isSignup,
    enteredNameIsValid,
    enteredNumberIsValid,
    enteredAddressIsValid
  ]);

  const history = useHistory();
  const closeBackdropHandler = () => {
    history.replace("/");
  };
  const signInHandler = () => {
    setIsSignup(!isSignup);
  };

  const {isLoading,error,sendRequest,clearError}=useHttpClient();

  const formSubmitHandler = async(event) => {
    event.preventDefault();
    if (!enteredEmailIsValid && !enteredPasswordIsValid) {
      return;
    }
    if(!isSignup){
      try{
        
        const responseData=await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/auth/login`,
          'POST',
          JSON.stringify({
            email:enteredEmail,
            password:enteredPassword
          }),
          {
            'Content-Type':'application/json'
          },
          
        );
        auth.login(responseData.userId,responseData.token,responseData.isAdmin);
        history.replace("/");
      }catch(err){
        console.log(err);
      }

    }else{
      try{
        const responseData=await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/auth/signup`,
          'POST',
          JSON.stringify({
            username:enteredName,
            email:enteredEmail,
            password:enteredPassword,
            address:enteredAddress,
            contactNo:enteredNumber
          }),
          {
            'Content-Type':'application/json'
          },
        );
        auth.login(responseData.userId,responseData.token);
        history.replace("/");
      }catch(err){
        console.log(err);
      }
      
    }
    // resetEmailInput();
    // resetPasswordInput();
    // resetNameInput();
    // resetNumberInput();
    // resetAddressInput();
  };

  const errorHandler=()=>{
    clearError();
  }

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={errorHandler}></ErrorModal>
    <div className={classes.contactFormContainer}>
      {isLoading&&<LoadingSpinner asOverlay={true}></LoadingSpinner>}
        <form onSubmit={formSubmitHandler}>
          <div className={classes.contactForm}>
            <h2>{isSignup ? "Create Account" : "Sign-In"}</h2>
            {isSignup && <label htmlFor="name">Name</label>}
            {isSignup && (
              <input
                type="text"
                id="name"
                onChange={nameChangedHandler}
                value={enteredName}
                onBlur={nameBlurHandler}
              ></input>
            )}
            {nameInputHasError && (
              <p className={classes.errorText}>Name cannot be empty</p>
            )}
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              onChange={emailChangedHandler}
              value={enteredEmail}
              onBlur={emailBlurHandler}
            ></input>
            {emailInputHasError && (
              <p className={classes.errorText}>
                Either email is empty or is invalid
              </p>
            )}
            <label type="password">Password</label>
            <input
              id="password"
              type="password"
              onChange={passwordChangedHandler}
              value={enteredPassword}
              onBlur={passwordBlurHandler}
            ></input>
            {passwordInputHasError && (
              <p className={classes.errorText}>Invalid password!</p>
            )}
            {isSignup && <label id="phoneNo">Contact No</label>}
            {isSignup && (
              <input
                id="phoneNo"
                type="number"
                value={enteredNumber}
                onChange={numberChangedHandler}
                onBlur={numberBlurHandler}
              ></input>
            )}
            {numberInputHasError && (
              <p className={classes.errorText}>
                Please enter a valid contact number!
              </p>
            )}
            {isSignup && <label id="address">Address</label>}
            {isSignup && (
              <input
                id="address"
                type="text"
                value={enteredAddress}
                onChange={addressChangedHandler}
                onBlur={addressBlurHandler}
              ></input>
            )}
            {addressInputHasError&&(<p className={classes.errorText}>Address can't be empty</p>)}
            <div className={classes.buttonContainer}>
              <button onClick={closeBackdropHandler}>Close</button>
              <button disabled={!formIsValid}>Submit</button>
            </div>
            <div className={classes.signInPara} onClick={signInHandler}>
              <p>
                {isSignup
                  ? "Already have an account? Login"
                  : `Don't have an account? Register!`}
              </p>
            </div>
          </div>
        </form>
    </div>
    </React.Fragment>
  );
};
export default Login;
