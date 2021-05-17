import classes from './WelcomeSummary.module.css';
import {NavLink} from 'react-router-dom';
const WelcomeSummary=()=>{
    return <div className={classes.summary}>
        <h2>Welcome to AMITEX BOOK STORE!</h2>
        <div className={classes.summaryPara}>
        <p>All Engineering Branch books are avaliable here!</p>
        <p>Delivery within 3 days at your location!</p>
        </div>
        <NavLink to="/books">Order Now!</NavLink>
    </div>
}
export default WelcomeSummary;