import { createContext } from "react";
const AuthContext = createContext({
  isLoggedIn: false,
  userId:null,
  isAdmin:false,
  token:null,
  cartItemCount:0,
  cartCounter:()=>{},
  login: () => {},
  logout: () => {},
});
export default AuthContext;
