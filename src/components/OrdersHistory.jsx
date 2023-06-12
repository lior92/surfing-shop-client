import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {  Button,Spinner } from "react-bootstrap";
import styles from "../styles/OrdersHistory.module.css";
import { contextData } from "../App";

const OrdersHistory = () => {
  const { currentUserDetails } = useContext(contextData);



  //Stats
  const [ordersHistory, setOrdersHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  //Hooks
  const navigate = useNavigate();

  //In case user refresh the page
  useEffect(() => {
    if (currentUserDetails && currentUserDetails.user_carts) {
      setOrdersHistory(currentUserDetails.user_carts);
      setLoading(false);
    }
  }, [currentUserDetails]);


  const displayOrders =
    ordersHistory.length !== 0 ? (
      <div className={styles.carts_container}>
        {ordersHistory.map((item) => {
          return (
            <div className={styles.cart_div} key={item._id} >
             {item.cart.cart_products.map((item,index,arr) => {
              // console.log(item.created_at)
              const createdAt = new Date(item.created_at);
              const formattedDateTime = createdAt.toLocaleString();
              let displayDateTime = false;
              if (index === 0) {
                displayDateTime = true;
              }
                return (
                  <div  key={item._id} >
{displayDateTime && ( <div className={styles.date_time}>
                      <p><strong>Date:</strong> {formattedDateTime.split(",")[0]}</p>
                      <p><strong>Time:</strong> {formattedDateTime.split(",")[1]}</p>
                    </div>
                    )}

                    <p><strong>Name:</strong> {item.product.product_name}</p>
                    <p><strong>Price:</strong> {item.product.product_price}$</p>
                    <p><strong>Quantity:</strong> {item.quantity}</p>
                    <p><strong>Description:</strong> {item.product.product_description}</p>
                     {index != arr.length-1&&<hr />}  
                  </div>
                );
              })} 
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
    );

  return (
    <div className={styles.order_history_main}>
          {loading ?      <div className="d-flex justify-content-center">
       <Spinner animation="border" role="status" style={{margin:"10%"}}>
         <span className="visually-hidden">Loading...</span>
       </Spinner>
     </div> : displayOrders}
    </div>
  );
};

export default OrdersHistory;
