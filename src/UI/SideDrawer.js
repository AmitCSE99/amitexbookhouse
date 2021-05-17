import classes from './SideDrawer.module.css';
import {CSSTransition} from 'react-transition-group';
const SideDrawer=(props)=>{
    return <CSSTransition in={props.show} timeout={200} classNames="slide-in-left" mountOnEnter unmountOnExit>
        <aside onClick={props.onClick} className={classes['side-drawer']}>{props.children}</aside>

        </CSSTransition>
}
export default SideDrawer