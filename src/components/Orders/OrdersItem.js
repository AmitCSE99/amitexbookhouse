import classes from './OrdersItem.module.css';
import OrderListItem from './OrderListItem';
const OrdersItem=props=>{

    let orderListItem=props.order.products.map(product=>(
        <OrderListItem product={product}></OrderListItem>
    ))


    return <li key={props.order.id} className={classes.listContainer}>
        
        <p>Order#{props.order.id}</p>
        <hr></hr>
        <ul className={classes.listItemContainer}>
            {orderListItem}
            <hr></hr>
        </ul>
        <p>Subtotal: ₹{props.order.subTotal}</p>
        <p>Order Date: {props.order.date}</p>
    </li>
}
export default OrdersItem;