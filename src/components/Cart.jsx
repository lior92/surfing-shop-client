
import React, { useContext, useEffect, useState } from "react";
import { contextData } from "../App";
import {Spinner }from "react-bootstrap";

import {
  Button,
  Col,
  Container,
  FormControl,
  InputGroup,
  Row,
} from "react-bootstrap";
import { FaShoppingCart } from "react-icons/fa";
import styles from "../styles/Cart.module.css";
import { useNavigate } from "react-router-dom";

import usePostRequest from "../usePostRequest";

const Cart = () => {

  //States
  const [all_total_price, setAllTotalPrice] = useState(0);

  const [loading, setLoading] = useState(true);


  //contextData from App: current user connected (originally from Login)
  const { currentUserDetails, setCurrentUser, cart, setCart, userControl } =
    useContext(contextData);

  //Hooks
  const navigate = useNavigate();
  const postUrl = "http://localhost:4000/carts/add";
  const { executePostRequest } = usePostRequest(postUrl);

//Functions

  //Spinner controller
  useEffect(()=>{
    if(cart){
      setLoading(false)
    }
  })


  //Buy the purchase and update the database
  const buyTheProducts = async () => {
    //First check if have purchase
    let shouldContinue = true;

    for (const product of cart) {
      if (product.quantity === 0) {
        alert("Must provide at least one product");
        shouldContinue = false;
        break;
      }
    }
    if (!shouldContinue) {
      return;
    }


    const postData = {
      user_objId: userControl._id || currentUserDetails._id,
      cart_products: cart,
    };

    //await the response from the usePostRequest hook
    const response = await executePostRequest(postData);

    if (response.success) {
      //If the current user is the manager, means that he added the cart to other user, and now he need to back to manager page
      if (currentUserDetails.user_permission == 3) {
        localStorage.clear();
        setCart([]);
        navigate(-1); //manager page
        return;
      }
      //Else
      //Update the current user
      setCurrentUser(response.user);

      alert("Thank you for buying in our store");
      localStorage.clear();
      setCart([]);
      navigate("/");
    }
  
if(response.response.data.error){
  alert("Sorry, you need to login first");
  localStorage.clear();
  document.cookie =
    "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  navigate("/");
  window.location.reload();
}
};

  //Recalculate the total price when cart changes
  useEffect(() => {
    let total_price = 0;
    for (const product of cart) {
      total_price += product.quantity * product.product_price;
    }
    setAllTotalPrice(total_price);
  }, [cart]);

  //Update product quantity in cart
  const handleQuantityChange = (e, product_id) => {
    const newQuantity = Number(e.target.value);

    const updatedCart = cart.map((product) => {
      if (product.product === product_id) {
        return { ...product, quantity: newQuantity };
      } else {
        return product;
      }
    });

    setCart(updatedCart);
    //update the local storage in case of refresh
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  //Remove product from cart
  const removeProduct = (id) => {
    let updated_cart = cart.filter((product) => product.product != id);
    setCart(updated_cart);
    //update the local storage in case of refresh
    localStorage.setItem("cart", JSON.stringify(updated_cart));
  };

  // Create jsx Display
  let display =
    cart.length > 0 ? (
      cart.map((product, index) => {
        // All products price

        return (
          <Row key={product.product} className="mb-3">
            <Col sm={3}>
              <img
                src={product.product_image}
                alt=""
                className={`w-100 ${styles.product_img}`}
              />
            </Col>
            <Col sm={6}>
              <h3>{product.product_category}</h3>
              <p>Total Price: {product.quantity * product.product_price}</p>
              <InputGroup className="mb-3">
                <InputGroup.Text>Quantity:</InputGroup.Text>
                <FormControl
                  style={{ width: "20%" }}
                  type="number"
                  min="0"
                  max="100"
                  defaultValue={product.quantity}
                  onChange={(e) => handleQuantityChange(e, product.product)}
                />
                <Button
                  variant="danger"
                  onClick={() => removeProduct(product.product)}
                >
                  Remove
                </Button>
              </InputGroup>
            </Col>
          </Row>
        );
      })
    ) : (
      <div>No products to buy</div>
    );

  return (
<>
{
loading?(
  <Spinner animation="border" role="status" >
      <span className="visually-hidden">Loading...</span>
    </Spinner>
):
(
  <Container className={styles.container}>
  <FaShoppingCart size={50} />

  <hr />
  {cart.length > 0 && (
    <Row className="justify-content-end mt-3">
      <Col sm={3} className="text-end">
        <h3>Total price:</h3>
      </Col>
      <Col sm={3} className="text-end">
        <h3>{all_total_price}$</h3>
      </Col>
      <Col sm={3} className="text-end">
        <Button variant="primary" onClick={buyTheProducts}>
          Buy
        </Button>
      </Col>
    </Row>
  )}
  <hr />
  {display}
</Container>
)

}


    </>
  );
};

export default Cart;
