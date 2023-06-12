import React from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Outlet,
  RouterProvider,
  Route,
  Routes,
} from "react-router-dom";
import { useEffect, useState } from "react";
import Login from "./components/Login";
import Register from "./components/Register";
import NavBar from "./components/navbar/NavBar";
import Home from "./components/Home";
import About from "./components/About";
import OrdersHistory from "./components/OrdersHistory";
import ClientSupport from "./components/ClientSupport";
import UserDetails from "./components/UserDetails";
import Blog from "./components/Blog";
import Cart from "./components/Cart";
import OneProduct from "./components/OneProduct";
import Forgot_password from "./components/Forgot_password";
import Footer from "./components/footer/Footer";
//Manager
import Manager from "./components/admin/Manager";
import Users from "./components/admin/Users";
import User from "./components/admin/User";
import Products from "./components/admin/Products";
import MangerSupport from "./components/admin/MangerSupport";
import ManagerChat from "./components/admin/ManagerChat";
import UserOrders from "./components/admin/UserOrders";
import Product from "./components/admin/Product";
//404
import Page404 from "./components/Page404";

export const contextData = React.createContext();

function App() {
  const [cookies, setCookies, removeCookies] = useCookies(["token"]);

  //states
  //Current user
  const [currentUserDetails, setCurrentUser] = useState("");

  //User control
  const [userControl, setUserControl] = useState("");
  //Cart
  const [cart, setCart] = useState(
    JSON.parse(localStorage.getItem("cart")) || []
  );

  //As long i have valid token i can make GET request and decode the token in the server, get that as a response and update the current user state
  //Important: the first update of the current user state, comes from the Login, the request below will not work on first render because he don't have token to decode yet, the purpose is to get data when user refresh pages
  useEffect(() => {
    axios
      .get("http://localhost:4000/users/auth", {
        headers: {
          Authorization: `Bearer ${cookies.token}`,
        },
      })
      .then((response) => {
        setCurrentUser(response.data.user);
      })
      .catch((err) => {
        // console.log(err);
      });
  }, []);

  //Protect the routes
  //Hide component when manager/editor get access to his route
  const hideComponent =
    currentUserDetails.user_permission == 3 ||
    currentUserDetails.user_permission == 2;

  //React router 6.4
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route
        path="*"
        element={
          <React.Fragment>
            {!hideComponent && <NavBar />}
            <Routes>
              <Route path="/" element={<Root />} />
              <Route index element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/forgot_password" element={<Forgot_password />} />
              <Route path="/register" element={<Register />} />
              <Route path="/user_details" element={<UserDetails />} />
              <Route path="/about" element={<About />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/orders_history" element={<OrdersHistory />} />
              <Route path="/client_support" element={<ClientSupport />} />
              <Route path="/one_product/:product_id" element={<OneProduct />} />
              <Route path="/cart" element={<Cart />} />
              {/*Protect the route */}
              {currentUserDetails.user_permission === 3 && (
                <Route path="/manager" element={<Manager />}>
                  <Route path="users" element={<Users />} />
                  <Route path="users/user/:user_id" element={<User />} />
                  <Route
                    path="user/user_orders/:user_id"
                    element={<UserOrders />}
                  />
                  <Route path="manager_support" element={<MangerSupport />} />
                  <Route
                    path="manager_chat/:user_id"
                    element={<ManagerChat />}
                  />
                  <Route path="products" element={<Products />} />
                  <Route path="product/:product_id" element={<Product />} />
                </Route>
              )}

              {/* reuse the component Products and protect the route*/}
              {currentUserDetails.user_permission === 2 && (
                <>
                  <Route path="/editor" element={<Products />} />
                  <Route path="/editor/:product_id" element={<Product />} />
                </>
              )}
              <Route path="*" element={<Page404 />} />
            </Routes>
            {!hideComponent && <Footer />}
          </React.Fragment>
        }
      />
    )
  );

  return (
    <div className="App">
      <contextData.Provider
        value={{
          setCurrentUser,
          currentUserDetails,
          setUserControl,
          userControl,
          setCart,
          cart,
        }}
      >
        <RouterProvider router={router} />
      </contextData.Provider>
    </div>
  );
}

const Root = () => (
  <>
    <Outlet />
  </>
);

export default App;
