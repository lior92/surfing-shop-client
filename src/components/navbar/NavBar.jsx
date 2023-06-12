import React, { useEffect, useState, useContext } from "react";
import { Link, useNavigate, useLocation  } from "react-router-dom";
import { Navbar, Nav, Container,InputGroup, FormControl, Button } from 'react-bootstrap';
import { FaShoppingCart } from "react-icons/fa";
import axios from "axios";
import  styles from "./navbar.module.css";
import { contextData } from "../../App";




const NavBar = () => {


  //States
  const [products, setProduct] = useState([]);
  const [searchTxt, setSearchTxt] = useState("");

  //toggle navbar
  const [expanded, setExpanded] = useState(false);

  //cart
  const [cartFull, setCartFull] = useState(false);

  //contextData from App: current user 
  const {currentUserDetails,cart} = useContext(contextData)

  //Hooks
  const navigate = useNavigate();
  const location = useLocation();
 


  //Functions

  useEffect(() => {
    //{ withCredentials: true } is a configuration option in Axios that enables sending cookies and authentication information in cross-origin requests
    //Get all products
    axios
      .get("http://localhost:4000/products/all_products")
      .then((response) => {
        if (response.data.success) {
          setProduct(response.data.products);
        }
      })
      .catch((error) => {
        console.log(error);
        console.log("error retrieving all products", error.message);
      });

if(cart.length>0){
  setCartFull(true)
}
else{
  setCartFull(false)
}
  }, [cart]);


  
  const logOut = async () => {
    navigate('/')
    localStorage.clear()
      document.cookie =
        "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        window.location.reload()
  };

  //JSX

  //User status 
  let logged_out = (
    <> 
    {location.pathname !== "/login" && <Link className={styles.login} to="/login">Login</Link>}
      {location.pathname !== "/register" && <Link  className={styles.register} to="/register">Register</Link>}
      </>);

 let logged_in = (
 <> 
      <Link className={styles.log_out} onClick={(e) => logOut()}> Log out </Link>
      <div>
      <span>logged as:</span> <Link className={styles.user_name} to="/user_details">{currentUserDetails.user_name}</Link> 
      </div>
        </> 
  );


  //Autocomplete input search values for filtered products
  let ul = (
    <ul className={styles.auto_complete}>
      {searchTxt == "" ? "" : 
      products.map((product) => {
            if (product.product_name.toLowerCase().startsWith(searchTxt)) {
              return (
                //clicking the link you want to redirect to single product page
                <li key={product._id} value={product.product_name}>
                  <Link to={`/one_product/${product._id}`} onClick={() => setSearchTxt("")}>
                    {product.product_name}
                  </Link>
                </li>
              );
            }
          })}
    </ul>
  );


  const toggleNavbar = () => {
    setExpanded(!expanded);
  }

  return (

<div className={styles.nav_bar_container}>
<div className={styles.top_container}>
<div className={styles.logged_in_out}>
{currentUserDetails ? logged_in : logged_out}
</div>


    <div className={styles.input_group_wrapper}>
    <InputGroup className={styles.input_group_costume}>
      <FormControl value={searchTxt}  placeholder="Search..." onChange={(e) => setSearchTxt(e.target.value)} />
      <Button variant="outline-secondary" onClick={() => navigate("/cart")}>
  <FaShoppingCart /> Cart 
  {cartFull && <span className={styles.cart_notification}>New</span>}
</Button>
</InputGroup>
   {ul}
   </div>


   </div>

        <Navbar className={styles.navbar_custom} expand="md" expanded={expanded}>
      <Container className={styles.container}>
        <Navbar.Brand className={styles.navbar_brand_custom}  as={Link} onClick={()=>toggleNavbar()} to="/">Home</Navbar.Brand>
        <Navbar.Toggle className={styles.navbar_toggle_custom} onClick={toggleNavbar} aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className={styles.nav}>
                <Nav.Link as={Link} to="/about" onClick={()=>toggleNavbar()}> About </Nav.Link>
                <Nav.Link as={Link} to="/blog" onClick={()=>toggleNavbar()}> Blog </Nav.Link>
                {/* Don't show to guests */}
                {currentUserDetails&&  <Nav.Link as={Link} onClick={()=>toggleNavbar()} to="/orders_history">Orders history </Nav.Link>}
                {currentUserDetails&& <Nav.Link as={Link} onClick={()=>toggleNavbar()} to="/client_support"> Support</Nav.Link>}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
      </div>
  );
};

export default NavBar;
