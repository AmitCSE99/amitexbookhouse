import { Fragment, useContext } from 'react';
import { useHistory } from 'react-router';
import AuthContext from '../../context/auth-context';
import useHttpClient from '../../hooks/use-http';
import LoadingSpinner from '../../UI/LoadingSpinner';
import ErrorModal from '../../UI/ErrorModal'
import classes from './AddressItem.module.css';
const AddressItem=props=>{
    const auth=useContext(AuthContext);
    const history=useHistory();
    const {isLoading,error,sendRequest,clearError}=useHttpClient();
    const editAddressHandler=()=>{
        history.push(`/addresses/${props.id}`);
    }
    const removeAddressHandler=async()=>{
        try{
            const responseData=await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/auth/remove-address`,'PATCH',JSON.stringify({
                userId:auth.userId,
                addressId:props.id
            }),{
                "Content-Type": "application/json",Authorization:'Bearer '+auth.token
            });
            console.log(responseData.address);
            props.updatedAddressesHandler(responseData.address);

        }catch(err){

        }
    }
    return <Fragment>
        <ErrorModal error={error} onClear={clearError}></ErrorModal>
        {isLoading&&<LoadingSpinner asOverlay></LoadingSpinner>}
        <li key={props.id} className={classes.addressItem}>
        <div className={classes.detailsContainer}>
            {/* <h3>Name</h3> */}
            <p>{props.address}</p>
            <div className={classes.optionsContainer}>
                <button onClick={editAddressHandler}>Edit</button>
                <button onClick={removeAddressHandler}>Delete</button>
            </div>
        </div>
    </li>
    </Fragment>
}
export default AddressItem