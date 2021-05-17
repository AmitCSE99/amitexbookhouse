import classes from './Cart.module.css';
import CartItem from './CartItem';
import {useEffect,useContext,useState } from 'react';
import useHttpClient from '../../hooks/use-http';
import AuthContext from '../../context/auth-context';
import { useHistory } from 'react-router';
const Cart=props=>{
    const auth=useContext(AuthContext);
    const {isLoading,error,sendRequest,clearError}=useHttpClient();
    const [loadedCart,setLoadedCart]=useState();
    const [loadedTotal,setLoadedTotal]=useState();
    const history=useHistory();
    let cartItems;
    useEffect(()=>{
        const userCart=async()=>{
            const responseData=await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/cart/items/${auth.userId}`);
            console.log(responseData);
            setLoadedTotal(responseData.totalPrice)
            setLoadedCart(responseData.items);
        }
        userCart();
    },[sendRequest]);

    const updateTotalPrice=(newPrice)=>{
        setLoadedTotal(newPrice);
    }

    const removeFromCart=(newBooks,updatedPrice)=>{
        setLoadedCart(newBooks);
        setLoadedTotal(updatedPrice);
        auth.cartCounter(newBooks.length);
    }
    const checkoutHandler=()=>{
        history.push('/checkout');
    }

    cartItems=!isLoading&&loadedCart&&loadedCart.map((item)=>(
        <CartItem
        key={item.productId}
        id={item.productId}
        updateCart={removeFromCart}
        >

        </CartItem>
    ))

    return <div className={classes.mainContainer}>
        {!isLoading&&loadedCart&&loadedCart.length!==0&&<h1>Your Cart</h1>}
        {!isLoading&&loadedCart&&loadedCart.length===0&&<h2>No items in your cart!</h2>}
        <div className={classes.container}>
        {!isLoading&&loadedCart&&loadedCart.length!==0&&<div className={classes.cartItemsContainer}>
            {!isLoading&&loadedCart&& <ul>
               {cartItems}
            </ul>}
        </div>}
        {!isLoading&&loadedCart&&loadedCart.length!==0&& <div className={classes.cartSubtotalContainer}>
            <p>FREE DELIVERY AVALIABLE</p>
            <h3>{`Subtotal: ₹${loadedTotal}`}</h3>
            <button onClick={checkoutHandler}>Proceed to buy</button>
        </div>}
    </div>
    </div>
}
export default Cart;
