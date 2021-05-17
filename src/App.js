import { Route, Switch, useHistory, Redirect,BrowserRouter as Router } from "react-router-dom";
import React, { useState, useCallback, useEffect, Fragment, Suspense } from "react";
import "./App.css";
// import BookDetail from "./pages/BookDetail";
import Books from "./pages/Books";
// import Checkout from './pages/Checkout';
import Home from "./pages/Home";
import Authentication from "./pages/Authentication";
// import AddProduct from "./pages/AddProduct";
import UserProducts from "./pages/UserProducts";
// import EditAddress from './pages/EditAddress';
// import AddAddress from './pages/AddAddress';
import EditProfile from './pages/EditProfile';
import ResetPassword from './pages/ResetPassword';
import User from "./pages/User";
import Cart from "./pages/Cart";
// import Orders from './pages/Orders';
// import Addresses from './pages/Addresses'
import MainHeader from "./UI/MainHeader";
import AuthContext from "./context/auth-context";
import EditProduct from "./pages/EditProduct";
import useHttpClient from "./hooks/use-http";
import LoadingSpinner from "./UI/LoadingSpinner";

const BookDetail=React.lazy(()=>import('./pages/BookDetail'))
const Checkout=React.lazy(()=>import('./pages/Checkout'))
const AddProduct=React.lazy(()=>import('./pages/AddProduct'))
const EditAddress=React.lazy(()=>import('./pages/EditAddress'))
const AddAddress=React.lazy(()=>import('./pages/AddAddress'))
const Orders=React.lazy(()=>import('./pages/Orders'))
const Addresses=React.lazy(()=>import('./pages/Addresses'))


let logoutTimer;

function App() {
  const history = useHistory();

  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isAdmin,setIsAdmin]=useState(false);
  const [cartCount,setCartCount]=useState(0);
  const [expirationDate,setExpirationDate]=useState();
  const {isLoading,error,sendRequest,clearError}=useHttpClient();

  

  const login = useCallback((userId,token,admin,expiration) => {
    setToken(token);
    setUserId(userId);
    setIsAdmin(admin);
    if(!admin){
    const getCartCount=async()=>{
      try{
        const responseData=await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/auth/getUser/${userId}`);
            console.log(responseData.user.cart.items.length);
            setCartCount(responseData.user.cart.items.length);
      }catch(err){

      }
    }
    getCartCount();
  }
    const expirationDate=expiration|| new Date(new Date().getTime()+2000*60*60);
    setExpirationDate(expirationDate);
    localStorage.setItem('userData',JSON.stringify({userId:userId,token:token,isAdmin:isAdmin,expirationDate:expirationDate.toISOString()}));
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUserId(null);
    setIsAdmin(false);
    setExpirationDate(null);
    localStorage.removeItem('userData');
    history.replace("/");
  }, []);


  

  useEffect(()=>{
    if(token&&expirationDate){
      const remainingTime=expirationDate.getTime()-new Date().getTime();
      logoutTimer= setTimeout(logout,remainingTime)
    }else{
      clearTimeout(logoutTimer);
    }
  },[token,logout,expirationDate])

  useEffect(()=>{
    const storedData= JSON.parse(localStorage.getItem('userData'));
    const check=async()=>{
      try{
        const responseData=await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/auth/getUser/${storedData.userId}`);
      setIsAdmin(responseData.user.isAdmin)

      }catch(err){}
    }
    check();
    console.log(storedData);
    if(storedData&&storedData.token&&new Date(storedData.expirationDate)>new Date()){
      login(storedData.userId,storedData.token,isAdmin,new Date(storedData.expirationDate));
    }
  },[login])

  const cartCounter=useCallback((newCartCount)=>{
    setCartCount(newCartCount);
    console.log(newCartCount);
  },[])



  let routes;
  if (token&&!isAdmin) {
    routes = (
      <Switch>
        <Route path="/" exact>
          <Home></Home>
        </Route>
        <Route path="/books" exact>
          <Books></Books>
        </Route>
        <Route path="/books/:bookId">
          <BookDetail></BookDetail>
        </Route>
        {/* <Route path="/user-products">
        <UserProducts></UserProducts>
      </Route>
      <Route path="/add-product">
        <AddProduct></AddProduct>
      </Route>
      <Route path="/edit-product/:bookId">
        <EditProduct></EditProduct>
      </Route> */}
      <Route path="/user">
        <User></User>
      </Route>
      <Route path="/cart">
        <Cart></Cart>
      </Route>
      <Route path="/addresses" exact>
        <Addresses></Addresses>
      </Route>
      <Route path="/addresses/:addressId">
        <EditAddress></EditAddress>
      </Route>
      <Route path="/add-address">
        <AddAddress></AddAddress>
      </Route>
      <Route path="/edit-profile">
        <EditProfile></EditProfile>
      </Route>
      <Route path="/reset-password">
        <ResetPassword></ResetPassword>
      </Route>
      <Route path="/checkout">
        <Checkout></Checkout>
      </Route>
      <Route path='/orders'>
        <Orders></Orders>
      </Route>
        <Redirect to="/"></Redirect>
      </Switch>
    );
  }else if(token&&isAdmin){
    routes=(
      <Switch>
        <Route path="/" exact>
          <Home></Home>
        </Route>
        <Route path="/user-products">
        <UserProducts></UserProducts>
      </Route>
      <Route path="/add-product">
        <AddProduct></AddProduct>
      </Route>
      <Route path="/edit-product/:bookId">
        <EditProduct></EditProduct>
      </Route>
        <Redirect to="/"></Redirect>
      </Switch>
    )
  }
   else {
    routes=(
      <Switch>
      <Route path="/" exact>
        <Home></Home>
      </Route>
      <Route path="/books" exact>
        <Books></Books>
      </Route>
      <Route path="/books/:bookId">
        <BookDetail></BookDetail>
      </Route>
      <Route path="/login">
          <Authentication></Authentication>
        </Route>
      <Redirect to="/login"></Redirect>
    </Switch>
    )
  }

  return (
    <Fragment>
      {isLoading&&<LoadingSpinner asOverlay></LoadingSpinner>}
    <AuthContext.Provider
      value={{
        cartItemCount:cartCount,
        cartCounter:cartCounter,
        isLoggedIn: !!token,
        token: token,
        userId: userId,
        isAdmin:isAdmin,
        login: login,
        logout: logout,
      }}
    >
      <Router>
        <MainHeader></MainHeader>
        {/* <Switch>
          <Route path="/" exact>
            <Home></Home>
          </Route>
          <Route path="/books" exact>
            <Books></Books>
          </Route>
          <Route path="/books/:bookId">
            <BookDetail></BookDetail>
          </Route>
          <Route path="/user-products">
            <UserProducts></UserProducts>
          </Route>
          <Route path="/add-product">
            <AddProduct></AddProduct>
          </Route>
          <Route path="/edit-product/:bookId">
            <EditProduct></EditProduct>
          </Route>
          <Route path="/contact">
            <Contacts></Contacts>
          </Route>
          <Route path="/login">
            <Authentication></Authentication>
          </Route>
          <Route path="/user">
            <User></User>
          </Route>
          <Route path="/cart">
            <Cart></Cart>
          </Route>
        </Switch> */}
        <main><Suspense fallback={
          <LoadingSpinner asOverlay></LoadingSpinner>
        }>{routes}</Suspense></main>
      </Router>
    </AuthContext.Provider>
    </Fragment>
  );
}

export default App;
