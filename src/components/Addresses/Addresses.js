import { Fragment, useContext, useEffect, useState } from "react";
import classes from './Addresses.module.css';
import AddressItem from './AddressItem';
import useHttpClient from '../../hooks/use-http';
import AuthContext from "../../context/auth-context";
import LoadingSpinner from "../../UI/LoadingSpinner";
import { useHistory } from "react-router";
const Addresses=props=>{
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
    const addAddressHandler=()=>{
        history.push('/add-address');
    }
    const updatedAddressesHandler=(updatedAddressess)=>{
        setLoadedAddresses(updatedAddressess);
    }
    

    listItems=!isLoading&&loadedAddresses&&loadedAddresses.map((address)=>(
        <AddressItem id={address.id} address={address.location} updatedAddressesHandler={updatedAddressesHandler}></AddressItem>
    ));

    

    return <Fragment>
        {isLoading&&<LoadingSpinner asOverlay></LoadingSpinner>}
        {!isLoading&&loadedAddresses&&<div className={classes.outerContainer}>
        <h2>Your Addresses</h2>
        <button className={classes.addAddressButton} onClick={addAddressHandler}>Add Address</button>
        <div className={classes.container}>
            <ul className={classes.addressContainer}>
                {listItems}
            </ul>
        </div>
        </div>}
    </Fragment>
}
export default Addresses; 