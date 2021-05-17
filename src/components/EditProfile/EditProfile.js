import useInput from "../../hooks/use-input";
import classes from "./EditProfile.module.css";
import { useState, useEffect } from "react";
import React from "react";
import { useContext } from "react";
import AuthContext from "../../context/auth-context";
import LoadingSpinner from "../../UI/LoadingSpinner";
import ErrorModal from "../../UI/ErrorModal";
import useHttpClient from "../../hooks/use-http";
const EditProfile = (props) => {
  const auth = useContext(AuthContext);
  const {isLoading,error,sendRequest,clearError}=useHttpClient();
//   const history = useHistory();
  const nameValidator = (value) => {
    return value.trim() != "";
  };

  const emailValidator = (value) => {
    return value.trim() != "" && value.includes("@");
  };

  const numberValidator = (value) => {
    return value.length === 10;
  };

  const [formIsValid, setFormIsValid] = useState(false);
  const {
    value: enteredName,
    isValid: enteredNameIsValid,
    hasError: nameInputHasError,
    valueChangeHandler: nameChangedHandler,
    inputBlurHandler: nameBlurHandler,
    setData: setName,
    reset: resetNameInput,
  } = useInput(nameValidator);

  const {
    value: enteredEmail,
    isValid: enteredEmailIsValid,
    hasError: emailInputHasError,
    valueChangeHandler: emailChangedHandler,
    inputBlurHandler: emailBlurHandler,
    setData:setEmail,
    reset: resetEmailInput,
  } = useInput(emailValidator);

  const {
    value: enteredNumber,
    isValid: enteredNumberIsValid,
    hasError: numberInputHasError,
    valueChangeHandler: numberChangedHandler,
    inputBlurHandler: numberBlurHandler,
    setData:setNumber,
    reset: resetNumberInput,
  } = useInput(numberValidator);
  const ac=new AbortController();

  useEffect(() => {
    if (enteredNameIsValid && enteredEmailIsValid && enteredNumberIsValid) {
      setFormIsValid(true);
    } else {
      setFormIsValid(false);
    }
    return () => ac.abort();
  }, [enteredEmailIsValid, enteredNameIsValid, enteredNumberIsValid]);


  useEffect(()=>{
      const getUser=async()=>{
          try{
            const responseData=await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/auth/getUser/${auth.userId}`);
            // console.log(responseData.user);
            setName(responseData.user.username);
            setEmail(responseData.user.email);
            setNumber(responseData.user.contactNo);
          }catch(err){

          }
      }
      getUser();
  },[sendRequest])
  
  const closeBackdropHandler = () => {
    history.back();
  };
  
  const formSubmitHandler=async(event)=>{
      event.preventDefault();
      if(!enteredNameIsValid&&!enteredEmailIsValid&&!enteredNumberIsValid){
          return;
      }
      try{
          const responseData=await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/auth/edit-profile`,'PATCH',JSON.stringify({
              userId:auth.userId,
              username:enteredName,
              email:enteredEmail,
              contactNo:enteredNumber
          }),{
            "Content-Type": "application/json",Authorization:'Bearer '+auth.token
          });

          alert('Profile is updated');

          history.back();
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
          <h2>Edit Profile</h2>
          <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              onChange={nameChangedHandler}
              value={enteredName}
              onBlur={nameBlurHandler}
            ></input>
          {nameInputHasError && (
            <p className={classes.errorText}>Name cannot be empty</p>
          )}
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="text"
            onChange={emailChangedHandler}
            value={enteredEmail}
            onBlur={emailBlurHandler}
          ></input>
          {emailInputHasError && (
            <p className={classes.errorText}>
              Either email is empty or is invalid
            </p>
          )}
          
          <label id="phoneNo">Contact No</label>
            <input
              id="phoneNo"
              type="number"
              value={enteredNumber}
              onChange={numberChangedHandler}
              onBlur={numberBlurHandler}
            ></input>
          {numberInputHasError && (
            <p className={classes.errorText}>
              Please enter a valid contact number!
            </p>
          )}
          <div className={classes.buttonContainer}>
            <button onClick={closeBackdropHandler}>Close</button>
            <button>Edit</button>
          </div>
        </div>
      </form>
  </div>
  </React.Fragment>
  )
}
export default EditProfile;
