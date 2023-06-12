
import React, {useContext, useEffect } from "react";
import { Card, Button,Spinner } from "react-bootstrap";
import styles from '../styles/Home.module.css'
import { Link } from "react-router-dom";
import { contextData } from "../App";
import useAxiosFetch from "../useGetRequest";
import { useCookies } from "react-cookie";


const Home = () => {
  const [cookies, setCookies, removeCookies] = useCookies(['token']);


  //useAxiosFetch get all products
  const { data: products, isLoading ,error} = useAxiosFetch(
    "http://localhost:4000/products/all_products",
    "products",
  );

 //contextData from App:
 const {setCart,cart} = useContext(contextData)


//Add product to cart
const addToCart = (e,product) => {
  let quantity =  Number(e.target.previousSibling.value) 
  if(quantity !== 0){
    
    const { _id, product_name, product_price, product_image,product_category } = product;

    // check if product already exists in cart
    const existingProductIndex = cart.findIndex(cartItem => cartItem.product === _id);

    if (existingProductIndex !== -1) {
      // update the quantity of the existing product in cart
      cart[existingProductIndex].quantity += quantity;

        // update the existing product in local storage
  let local_cart = JSON.parse(localStorage.getItem('cart')) || [];
  local_cart[existingProductIndex].quantity += quantity;
  localStorage.setItem('cart', JSON.stringify(local_cart));


    } else {
      // add new product to cart
      const new_purchase = {
        product: _id,
        quantity,
        product_name,
        product_price,
        product_image,
        product_category
      };
      setCart([...cart,new_purchase])

      //Set in localstorage in case the page is reloaded
      let local_cart =  JSON.parse(localStorage.getItem('cart'))?JSON.parse(localStorage.getItem('cart')):[]
      local_cart.push(new_purchase)
      localStorage.setItem('cart', JSON.stringify(local_cart))
    }

  } else {
    alert('Must provide a number')
  }
};



//Error handling
if (error) {
  return (
    <div className={styles.error_container}>
      <p>Failed to get products. Please try again later.</p>
    </div>
  );
}


return (
  <div >
 <div className={styles.introduction}>
<p className={styles.introduction_header}>LET`S GO SHOPPE!</p>
<p>surfing_style.co.il is 1st online stor who makes delivery for surfing gear.</p>
<p style={{fontWeight:"500",color:"#505152"}}>MINIMUM ORDER: 100$ BEFORE DELIVERY CHARGES.</p>
<p>We invite you to enjoy our store</p>
</div> 


    {isLoading ? (
       <div className="d-flex justify-content-center">
       <Spinner animation="border" role="status" style={{margin:"10%"}}>
         <span className="visually-hidden">Loading...</span>
       </Spinner>
     </div>
    ) : (  
      <div  className={`d-flex flex-wrap ${styles.custom_flex_wrap}`}>
        {products &&products.map((product) => {
          return (
            <Card key={product._id} style={{ width: "10rem", margin: "1rem",border: "none" }}>
            <Link to={`/one_product/${product._id}`}>
              <Card.Img className={styles.Card_img_costume} variant="top" src={product.product_image} />
              </Link>
              <Card.Body className={styles.Card_body}>
                <Card.Title>{product.product_name}</Card.Title>
                {/* <Card.Text>{product.product_description}</Card.Text> */}
                <Card.Text>Price: {product.product_price}$</Card.Text>
                <div className={`d-flex justify-content-between align-items-center ${styles.inp_btn_wrap}`}>
                  <input className={styles.Card_input} type="number" min="0" max="100" defaultValue="0" />
                  <Button variant="primary" onClick={(e) => addToCart(e, product)}>
                    Add
                  </Button>
                </div>
              </Card.Body>
            </Card>
          );
        })}
      </div>
    )}
  </div>
);
};

export default Home;