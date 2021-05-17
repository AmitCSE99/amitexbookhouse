import classes from './OrderListItem.module.css';
const OrderListItem=props=>{
    return <li className={classes.listItemContainer}>
        <div className={classes.outerContainer}>
            <div className={classes.imageContainer}>
                <img src={`${process.env.REACT_APP_ASSET_URL}/${props.product.image}`}></img>
            </div>
            <div className={classes.detailsContainer}>
                <p>Title: {props.product.title}</p>
                
                <p>Price: ₹{props.product.price}</p>
            </div>

        </div>
    </li>
}
export default OrderListItem;