import { Fragment, useContext, useEffect, useState } from 'react';
import AuthContext from '../../context/auth-context';
import useHttpClient from '../../hooks/use-http';
import ErrorModal from '../../UI/ErrorModal';
import LoadingSpinner from '../../UI/LoadingSpinner';
import classes from './Orders.module.css';
import OrdersItem from './OrdersItem';
const Orders=props=>{
    const auth=useContext(AuthContext);
    const [orderData,setOrderData]=useState();
    const {isLoading,error,sendRequest,clearError}=useHttpClient();

    useEffect(()=>{
        const getOrders=async()=>{
            try{
                const responseData=await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/order/get-orders/${auth.userId}`);
                setOrderData(responseData.orders);
            }catch(err){

            }
        }
        getOrders();
    },[sendRequest])

    let ordersItem=!isLoading&&orderData&&orderData.map(order=>(
        <OrdersItem order={order}></OrdersItem>
    ))

    return <Fragment>
        <ErrorModal error={error} onClear={clearError}></ErrorModal>
        {!isLoading&&orderData===0&&<h2 className={classes.noOrders}>No Orders Found!!</h2>}
        {isLoading&&<LoadingSpinner asOverlay></LoadingSpinner>}
        {!isLoading&&orderData&& <div className={classes.outerContainer}>
            <h2>Your Orders</h2>
        <ul className={classes.orderListContainer}>
            {ordersItem}
        </ul>
    </div>}
    </Fragment>
}
export default Orders;