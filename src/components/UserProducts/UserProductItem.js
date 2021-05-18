import classes from './UserProductItem.module.css';
import {useHistory} from 'react-router-dom';
import useHttpClient from '../../hooks/use-http';
import { Fragment,useContext } from 'react';
import ErrorModal from '../../UI/ErrorModal';
import LoadingSpinner from '../../UI/LoadingSpinner';
import AuthContext from '../../context/auth-context';
const UserProductItem=props=>{
    const history=useHistory();
    const auth=useContext(AuthContext);

    const editProduct=()=>{
        history.push(`/edit-product/${props.id}`);
    }
    const {isLoading,error,sendRequest,clearError}=useHttpClient();
    const deleteProduct=async()=>{
        try{
            await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/books/${props.id}`,'DELETE',null,{
                Authorization:'Bearer '+auth.token
            });
            history.replace('/');
        }catch(err){

        }
    }

    return <Fragment>
        <ErrorModal error={error} onClear={clearError}></ErrorModal>
        {isLoading&&<div className={classes.centered}>
            <LoadingSpinner></LoadingSpinner>
            </div>}
        
        <li className={classes.listItem}>
        
        <div className={classes.bookItem}>
            <img src={`${process.env.REACT_APP_BACKEND_URL}/books/getImage/${props.imageSrc}`}></img>
            <p>{props.title}</p>
            <p>{`₹${props.price}`}</p>
            <div className={classes.buttonsContainer}>
            <button onClick={editProduct}>Edit Book</button>
            <button onClick={deleteProduct}>Delete Book</button>
            </div>
            
        </div>
    </li>
    </Fragment>
}
export default UserProductItem;