import { Fragment, useContext, useEffect, useState } from "react";
import classes from './Checkout.module.css';
import CheckoutItem from './CheckoutItem';
import useHttpClient from '../../hooks/use-http';
import AuthContext from "../../context/auth-context";
import LoadingSpinner from "../../UI/LoadingSpinner";
import { useHistory } from "react-router";
const Checkout=props=>{
    let listItems;
    const history=useHistory();
    const auth=useContext(AuthContext);
    const [loadedAddresses,setLoadedAddresses]=useState();
    const {isLoading,error,sendRequest,clearError}=useHttpClient();
    useEffect(()=>{
        const getUser=async()=>{
            try{
                const responseData=await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/auth/getUser/${auth.userId}`)
                console.log(responseData.user.address);
                setLoadedAddresses(responseData.user.address);
            }catch(err){
                
            }
        }
        getUser();
    },[sendRequest]);
    listItems=!isLoading&&loadedAddresses&&loadedAddresses.map((address)=>(
        <CheckoutItem id={address.id} address={address.location}></CheckoutItem>
    ));
    return <Fragment>
    {isLoading&&<LoadingSpinner asOverlay></LoadingSpinner>}
    {!isLoading&&loadedAddresses&&<div className={classes.outerContainer}>
    <h2>Select Your Delivery Address</h2>
    <div className={classes.container}>
        <ul className={classes.addressContainer}>
            {listItems}
        </ul>
    </div>
    </div>}
</Fragment>
}
export default Checkout;