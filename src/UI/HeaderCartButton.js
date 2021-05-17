import CartIcon from "./CartIcon";
import classes from "./HeaderCartButton.module.css";
import { useContext, useEffect, useState } from "react";
import AuthContext from "../context/auth-context";
import useHttpClient from "../hooks/use-http";
import { NavLink } from "react-router-dom";
const HeaderCartButton = (props) => {
  const auth = useContext(AuthContext);
  const [cartCount,setCartCount]=useState(0);
  const {isLoading,error,sendRequest,clearError}=useHttpClient();
//   useEffect(()=>{
//     const getUser=async()=>{
//         try{
//             const responseData=await sendRequest(`http://localhost:5000/api/auth/getUser/${auth.userId}`);
//             console.log(responseData.user.cart.items.length);
//             auth.cartItemCount=responseData.user.cart.items.length;
//             setCartCount(responseData.user.cart.items.length);
//         }catch(err){

//         }
//     }
//     getUser();
// },[sendRequest,auth.cartItemCount])


  return (
    <button className={classes.button} onClick={props.onClick}>
      <span className={classes.icon}>
        <CartIcon></CartIcon>
      </span>
      <span>
        Cart
      </span>
      <span className={classes.badge}>{auth.cartItemCount}</span>
    </button>
  );
};
export default HeaderCartButton;
