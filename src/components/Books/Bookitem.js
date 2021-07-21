import classes from './Bookitem.module.css';
import {useHistory} from 'react-router-dom';
import {Fragment, useContext, useEffect, useState} from 'react';
import AuthContext from '../../context/auth-context';
import useHttpClient from '../../hooks/use-http';
import LoadingSpinner from '../../UI/LoadingSpinner';
import ErrorModal from '../../UI/ErrorModal'
const Bookitem=props=>{
    const history=useHistory();
    const auth=useContext(AuthContext);
    const {isLoading,error,sendRequest,clearError}=useHttpClient();
    const {image,setImage}=useState();

    const addToCartHandler=async()=>{
        if(!auth.isLoggedIn){
            history.push('/login');
        }else{
            console.log(auth.cartItemCount);
            try{
                const responseData=await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/cart/addToCart`,'PATCH',JSON.stringify({
              userId:auth.userId,
              productId:props.id,
              item:{
                  productId:props.id,
                  quantity:1,
                  productPrice:props.price
              }  
            }),{ "Content-Type": "application/json",Authorization:'Bearer '+auth.token});

            try{
                const responseData=await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/auth/getUser/${auth.userId}`);
                auth.cartCounter(responseData.user.cart.items.length);
            }catch(err){

            }

            }catch(err){

            }
        }

    }
    const bookDetailHandler=()=>{
        console.log('clicked');
        history.push(`/books/${props.id}`);
    }

    return <Fragment>
        <ErrorModal error={error} onClear={clearError}></ErrorModal>
        {isLoading&&<LoadingSpinner asOverlay></LoadingSpinner>}
        <li className={classes.listItem}>
        
        <div className={classes.bookItem}>
            {/* <img src={`${process.env.REACT_APP_BACKEND_URL}/books/getImage/${props.imageSrc}`} onClick={bookDetailHandler}></img> */}
            <img src={props.imageSrc} onClick={bookDetailHandler}></img>
            <p>{props.title}</p>
            <p>{`₹${props.price}`}</p>
            <button onClick={addToCartHandler}>Add to Cart</button>
        </div>
    </li>
    </Fragment>

}
export default Bookitem;