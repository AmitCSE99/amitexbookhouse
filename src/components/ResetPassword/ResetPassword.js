import useInput from "../../hooks/use-input";
import classes from './ResetPassword.module.css';
import { useState, useEffect } from "react";
import React from "react";
import { useHistory, useParams } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../../context/auth-context";
import LoadingSpinner from "../../UI/LoadingSpinner";
import ErrorModal from "../../UI/ErrorModal";
import useHttpClient from "../../hooks/use-http";
const ResetPassword=props=>{
  const history=useHistory();
    const auth = useContext(AuthContext);
  const {isLoading,error,sendRequest,clearError}=useHttpClient();
//   const history = useHistory();
  const passwordValidator = (value) => {
    return value.length>6;
  };

  
  const confirmPasswordValidator = (value) => {
    return value.length>6;
  };

  const [formIsValid, setFormIsValid] = useState(false);
  const {
    value: enteredPassword,
    isValid: enteredPasswordIsValid,
    hasError: passwordInputHasError,
    valueChangeHandler: passwordChangedHandler,
    inputBlurHandler: passwordBlurHandler,
  } = useInput(passwordValidator);

  const {
    value: enteredConfirmPassword,
    isValid: enteredConfirmPasswordIsValid,
    hasError: confirmPasswordInputHasError,
    valueChangeHandler: confirmPasswordChangedHandler,
    inputBlurHandler: confirmPasswordBlurHandler,
  } = useInput(confirmPasswordValidator);

  const ac=new AbortController();

  useEffect(() => {
    if (enteredPasswordIsValid && enteredConfirmPasswordIsValid) {
      setFormIsValid(true);
    } else {
      setFormIsValid(false);
    }
    return () => ac.abort();
  }, [enteredPasswordIsValid, enteredConfirmPasswordIsValid]);

  const closeBackdropHandler = () => {
    history.goBack();
  };

  const formSubmitHandler=async(event)=>{
      event.preventDefault();
      try{
        const responseData=await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/auth/reset-password`,'PATCH',JSON.stringify({
            userId:auth.userId,
            password:enteredPassword,
            confirmPassword:enteredConfirmPassword
        }),{
            "Content-Type": "application/json",Authorization:'Bearer '+auth.token
        });
        alert('Password is reset sucessfully');
        auth.logout();
      }catch(err){

      }
  }

    return (
        <React.Fragment>
    <ErrorModal error={error} onClear={clearError}></ErrorModal>
  <div className={classes.contactFormContainer}>
    {isLoading&&<LoadingSpinner asOverlay={true}></LoadingSpinner>}
      <form onSubmit={formSubmitHandler}>
        <div className={classes.contactForm}>
          <h2>Reset Password</h2>
          <label htmlFor="password">Re-enter Password</label>
            <input
              type="password"
              id="password"
              onChange={passwordChangedHandler}
              value={enteredPassword}
              onBlur={passwordBlurHandler}
            ></input>
          {passwordInputHasError && (
            <p className={classes.errorText}>Password must be at least of 6 characters</p>
          )}
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            id="confirmPassword"
            type="password"
            onChange={confirmPasswordChangedHandler}
            value={enteredConfirmPassword}
            onBlur={confirmPasswordBlurHandler}
          ></input>
          {confirmPasswordInputHasError && (
            <p className={classes.errorText}>
              Password must be at least of 6 characters
            </p>
          )}
          
          <div className={classes.buttonContainer}>
            <button onClick={closeBackdropHandler}>Close</button>
            <button>Reset</button>
          </div>
        </div>
      </form>
  </div>
  </React.Fragment>
    )
}
export default ResetPassword;