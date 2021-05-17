import {useState} from 'react';
const useInput=(validateValue,initalValue='')=>{
    const [enteredValue,setEnteredValue]=useState(initalValue);
    const [isTouched,setIsTouched]=useState(false);
    let valueIsValid=validateValue(enteredValue);
    const hasError=!valueIsValid && isTouched;
    const valueChangeHandler=event=>{
        setEnteredValue(event.target.value);
    }
    const inputBlurHandler=event=>{
        setIsTouched(true);
    }
    const reset=()=>{
        setEnteredValue('');
        setIsTouched(false);
    }
    const setData=(settingValue)=>{
        setEnteredValue(settingValue);
    }
    const inputHandler=(id,value,isValid)=>{
        setEnteredValue(value);
        valueIsValid=isValid;
        id="image"
    }
    return {
        value:enteredValue,hasError,valueChangeHandler,inputBlurHandler,isValid:valueIsValid,reset,setData,inputHandler
    }


}
export default useInput;