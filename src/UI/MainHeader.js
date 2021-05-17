import { Fragment,useState,useContext } from "react";
import { NavLink,useHistory } from "react-router-dom";
import classes from "./MainHeader.module.css";
import SideDrawer from "./SideDrawer";
import Backdrop from './Backdrop';
import AuthContext from '../context/auth-context';
import HeaderCartButton from "./HeaderCartButton";
const MainHeader = () => {

  const auth=useContext(AuthContext);

  const history=useHistory();
    const [drawerIsOpen,setDrawerIsOpen]=useState(false);
    const openDrawerHandler=()=>{
        setDrawerIsOpen(true);
    }
    const closeDrawerHandler=()=>{
        setDrawerIsOpen(false);
    }
    const cartNavHandler=()=>{
      history.push('/cart');

    }
    const logoutHandler=()=>{
      auth.logout();
    }
  return (
    <Fragment>
        {drawerIsOpen&&<Backdrop onClick={closeDrawerHandler}></Backdrop>}
      <SideDrawer onClick={closeDrawerHandler} show={drawerIsOpen}>
        <nav className={classes["main-navigation__drawer-nav"]}>
        <ul className={classes['navigation-side-drawer']}>
          <li>
            <NavLink to="/" exact activeClassName={classes.active}>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/books" activeClassName={classes.active}>
              Books
            </NavLink>
          </li>
          {auth.isLoggedIn&&auth.isAdmin&& <li>
            <NavLink to="/user-products" activeClassName={classes.active}>
              Your Products
            </NavLink>
          </li>}
          {auth.isLoggedIn&&auth.isAdmin&& <li>
            <NavLink to="/add-product" activeClassName={classes.active}>
              Add Products
            </NavLink>
          </li>}
          {!auth.isLoggedIn&& <li>
            <NavLink to="/login" activeClassName={classes.active}>
              Login
            </NavLink>
          </li>}
          
          {auth.isLoggedIn&&!auth.isAdmin&& <li>
            <NavLink to="/user" activeClassName={classes.active}>
              Your Account
            </NavLink>
          </li>}
          {/* {auth.isLoggedIn&&!auth.isAdmin&& <li>
            <NavLink to="/cart" activeClassName={classes.active} >
              Your Cart
            </NavLink>
          </li>} */}
          {auth.isLoggedIn&&(<p className={classes.logoutPara} onClick={logoutHandler}>Logout</p>)}
        </ul>
        </nav>
      </SideDrawer>
      <nav className={classes.nav}>
        <button className={classes["main-navigation__menu-btn"]} onClick={openDrawerHandler}>
          <span></span>
          <span></span>
          <span></span>
        </button>
        <h2>AMITEX BOOK SHOP</h2>
        <ul className={classes.nav1}>
          <li>
            <NavLink to="/" exact activeClassName={classes.active}>
              Home
            </NavLink>
          </li>
          {!auth.isAdmin&& <li>
            <NavLink to="/books" activeClassName={classes.active}>
              Books
            </NavLink>
          </li>}
          {auth.isLoggedIn&&!auth.isAdmin&& <li>
            <NavLink to="/user" activeClassName={classes.active}>
              Your Account
            </NavLink>
          </li>}
          {auth.isLoggedIn&&auth.isAdmin&& <li>
            <NavLink to="/user-products" activeClassName={classes.active}>
              Your Products
            </NavLink>
          </li>}
          {auth.isLoggedIn&&auth.isAdmin&& <li>
            <NavLink to="/add-product" activeClassName={classes.active}>
              Add Products
            </NavLink>
          </li>}
        </ul>
        <ul className={classes.nav2}>
          {!auth.isLoggedIn&& <li>
            <NavLink to="/login" activeClassName={classes.active}>
              Login
            </NavLink>
          </li>}
          {auth.isLoggedIn&&<p className={classes.logoutPara} onClick={logoutHandler}>Logout</p>}
          
          
        </ul>
        {auth.isLoggedIn&&!auth.isAdmin&&<div className={classes.headerCart}>
        <HeaderCartButton onClick={cartNavHandler}></HeaderCartButton>
        </div>}
      </nav>
    </Fragment>
  );
};
export default MainHeader;
