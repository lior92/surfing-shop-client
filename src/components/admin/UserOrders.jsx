import axios from "axios";
import React, { useEffect, useState, useContext } from "react";
import { useCookies } from "react-cookie";

import { useNavigate, useParams } from "react-router-dom";
import {  Button,Spinner } from "react-bootstrap";
import { FaShoppingCart } from "react-icons/fa";

import styles from "../../styles/Manager_user_orders.module.css";
import { contextData } from "../../App";
import useAxiosFetch from "../../useGetRequest";

const UserOrders = () => {
  //useAxiosFetch get all products
  const { data: products, isLoading } = useAxiosFetch(
    "http://localhost:4000/products/all_products",
    "products",
  );

  //States
  const [cookies, setCookies, removeCookies] = useCookies(['token']);
  const [carts, setCarts] = useState([]);
  //Cart note
  const [cartFull, setCartFull] = useState(false);

  //ContextData
  const{cart,setCart,setUserControl}=useContext(contextData)

  //Hooks
  const { user_id } = useParams();
  const navigate = useNavigate();


  //Functions

  //Get user
  useEffect(() => {
    axios
      .get(`http://localhost:4000/users/get_user/${user_id}`, {
        headers: {
          Authorization: `Bearer ${cookies.token}`
        }
      })
      .then((response) => {
        setCarts(response.data.user.user_carts);
        setUserControl(response.data.user)
      })
      .catch((err) => {
        console.log(err);
      });

  }, []);

//Add note to cart button when full
  useEffect(()=>{
    if(cart.length>0){
      setCartFull(true)
    }
    else{
      setCartFull(false)
    }
  },[cart])

  //Delete cart
  const deleteCart = (cart_index, cart_id) => {
    // //Ask before deleting
    const confirmDelete = window.confirm(
      "Are you sure you want to delete the cart?"
    );
    if (!confirmDelete) {
      return;
    }
    //Else
    const filtered_array = carts.filter((cart, index) => index != cart_index);

    const data = {
      user_id: user_id,
      user_carts: filtered_array,
    };

    axios
      .put("http://localhost:4000/users/update_user", data, {
        headers: {
          Authorization: `Bearer ${cookies.token}`,
        }
      })
      .then((response) => {
        if (response.data.success) {
          //Now delete the cart from carts documentation in database (Keep it updated)
          axios
            .delete("http://localhost:4000/carts/delete", {
              data: {
                cart_id:cart_id
              },
              headers: {
                Authorization: `Bearer ${cookies.token}`,
              },
            })
            .then((response) => {
              if (response.data.success) {
                //If both requests are true update carts state
                setCarts(filtered_array);
              }
            })
            .catch((err) => console.error(err));
        }
      })
      .catch((err) => console.log(err));
  };

  //Edit cart
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
  
      //reset the quantity counter
      e.target.previousSibling.value='0';
    } else {
      alert('Must provide a number')
    }
  };

  return (
<div className={styles.order_history_main}>

{/* Order history */}
<div className={styles.order_history}>
  {isLoading ? (
    <Spinner animation="border" role="status"></Spinner>
  ) : (
    <>
      {carts.length !== 0 ? (
        <div className={styles.carts_container}>
          {carts.map((item, cart_index) => {
            return (
              <div className={styles.cart_div} key={item._id}>
                {item.cart.cart_products.map((item, product_index, arr) => {
                  const createdAt = new Date(item.created_at);
                  const formattedDateTime = createdAt.toLocaleString();
                  let displayDateTime = false;
                  if (cart_index === 0) {
                    displayDateTime = true;
                  }
                  return (
                    <div key={item._id}>
                      {displayDateTime && (
                        <div className={styles.date_time}>
                          <p>
                            <strong>Date:</strong> {formattedDateTime.split(",")[0]}
                          </p>
                          <p>
                            <strong>Time:</strong> {formattedDateTime.split(",")[1]}
                          </p>
                        </div>
                      )}

                      <p>
                        <strong>Name:</strong> {item.product.product_name}
                      </p>
                      <p>
                        <strong>Price:</strong> {item.product.product_price}$
                      </p>
                      <p>
                        <strong>Quantity:</strong> {item.quantity}
                      </p>
                      <p>
                        <strong>Description:</strong> {item.product.product_description}
                      </p>
                      {product_index != arr.length - 1 && <hr />}
                    </div>
                  );
                })}
                <button
                  className={styles.delete_btn}
                  onClick={(e) => deleteCart(cart_index, item.cart._id)}
                >
                  delete
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <div>
          <h5>No orders history</h5>
          <Button onClick={() => navigate(-1)} variant="secondary">
            Back
          </Button>
        </div>
      )}
    </>
  )}
</div>


      <div className={styles.sidebar}>


{/* Cart button */}

<Button className={styles.cart_btn} variant="outline-secondary" onClick={() => navigate("/cart")}>
<FaShoppingCart /> Cart 
{cartFull && <span className={styles.cart_notification}>New</span>}
</Button>
     

{/*Products side bar*/}

        <div className={styles.productList}>
          {isLoading ? (
             <Spinner animation="border" role="status" style={{ margin: "5%" }}>
             <span className="visually-hidden">Loading...</span>
           </Spinner>
          ) : (
            products.map((product) => {
              return (
                <div key={product._id} className={styles.productItem}>
                  <p>name:{product.product_name}</p>
                  <p>description:{product.product_description}</p>
                  <p>
                    <strong> price:</strong>
                    {product.product_price}
                  </p>
                  <img
                    style={{ objectFit: "cover", height: "100px" }}
                    src={product.product_image}
                    alt=""
                  />
                  <p>quantity:</p>{" "}
                  <div className={styles.side_bar_add_div}>
                    <input type="number" min="0" max="100" defaultValue="0" />
                    <button onClick={(e) => addToCart(e, product)}>
                      Add product
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default UserOrders;
