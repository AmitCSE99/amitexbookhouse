import { Fragment, useContext } from 'react';
import { useHistory } from 'react-router';
import AuthContext from '../../context/auth-context';
import useHttpClient from '../../hooks/use-http';
import LoadingSpinner from '../../UI/LoadingSpinner';
import ErrorModal from '../../UI/ErrorModal';
import classes from './CheckoutItem.module.css';
const CheckoutItem=props=>{
    const auth=useContext(AuthContext);
    const history=useHistory();
    const {isLoading,error,sendRequest,clearError}=useHttpClient();
    const ordersHandler=async()=>{
        try{
            const responseData=await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/order/place-order`,'POST',JSON.stringify({
                userId:auth.userId,
                addressId:props.id
            }),{
                "Content-Type": "application/json",Authorization:'Bearer '+auth.token
            });
            auth.cartCounter(0);
            alert("Your Order is placed Sucessfully")
            history.push('/');
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
                <button onClick={ordersHandler}>Deliver to this Address</button>
            </div>
        </div>
    </li>
    </Fragment>
}
export default CheckoutItem;
