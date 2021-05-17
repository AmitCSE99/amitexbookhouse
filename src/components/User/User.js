import { Fragment } from "react";
import classes from './User.module.css';
import orderImage from '../../assets/orders.jpg';
import loginImage from '../../assets/login.jpg';
import addressImage from '../../assets/address.jpg';
import passwordImage from '../../assets/password.jpg'
import { useHistory } from "react-router";
const User=props=>{

    const history=useHistory();

    const ordersRedirectHandler=()=>{
        history.push('/orders');
    }

    const addressRedirectHandler=()=>{
        history.push('/addresses');
    }

    const editProfileRedirectHandler=()=>{
        history.push('/edit-profile');
    }

    const resetPassword=()=>{
        history.push('/reset-password');
    }


    return <Fragment>
        <div className={classes.outerContainer}>
            <div className={classes.ordersContainer} onClick={ordersRedirectHandler}>
                <div className={classes.orderImageContainer}>
                    <img src={orderImage}></img>
                </div>
                <div className={classes.orderDetailsContainer}>
                    <h3>Your Orders</h3>
                    <p>View Order History</p>
                </div>
            </div>
            <div className={classes.loginContainer} onClick={editProfileRedirectHandler}>
                <div className={classes.loginImageContainer}>
                    <img src={loginImage}></img>
                </div>
                <div className={classes.loginDetailsContainer}>
                    <h3>Login and Security</h3>
                    <p>Edit your account</p>
                </div>
            </div>
            <div className={classes.addressContainer} onClick={addressRedirectHandler}>
                <div className={classes.addressImageContainer}>
                    <img src={addressImage}></img>
                </div>
                <div className={classes.addressDetailsContainer}>
                    <h3>Your Addresses</h3>
                    <p>Manage your Addresses</p>
                </div>
                
            </div>
            <div className={classes.passwordContainer} onClick={resetPassword}>
                <div className={classes.passwordImageContainer}>
                    <img src={passwordImage}></img>
                </div>
                <div className={classes.passwordDetailsContainer}>
                    <h3>Change Your Password</h3>
                    <p>Reset your password</p>
                </div>
            </div>
        </div>
    </Fragment>
}
export default User;