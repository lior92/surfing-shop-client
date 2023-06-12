import React, {  useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button,Spinner } from "react-bootstrap";
import { FaShoppingCart } from "react-icons/fa";
import { contextData } from "../App";
import useAxiosFetch from "../useGetRequest";

const OneProduct = () => {
  // get the product_id param
  const { product_id } = useParams();

  //useAxiosFetch get product
  const { data: product, isLoading } = useAxiosFetch(
    `http://localhost:4000/products/get_by_id/${product_id}`,
    "product",
  );

  // state
  const [quantity, setQuantity] = useState(0);

  //contextData
  const { cart, setCart } = useContext(contextData);

  //Hooks
  const navigate = useNavigate();



  const addToCart = (e, product) => {
    let quantity = Number(e.target.previousSibling.value);
    if (quantity !== 0) {
      const {
        _id,
        product_name,
        product_price,
        product_image,
        product_category,
      } = product;

      // check if product already exists in cart
      const existingProductIndex = cart.findIndex(
        (cartItem) => cartItem.product === _id
      );

      if (existingProductIndex !== -1) {
        // update the quantity of the existing product in cart
        cart[existingProductIndex].quantity += quantity;

        // update the existing product in local storage
        let local_cart = JSON.parse(localStorage.getItem("cart")) || [];
        local_cart[existingProductIndex].quantity += quantity;
        localStorage.setItem("cart", JSON.stringify(local_cart));
      } else {
        // add new product to cart
        const new_purchase = {
          product: _id,
          quantity,
          product_name,
          product_price,
          product_image,
          product_category,
        };
        setCart([...cart, new_purchase]);

        //Set in localstorage in case the page is reloaded
        let local_cart = JSON.parse(localStorage.getItem("cart"))
          ? JSON.parse(localStorage.getItem("cart"))
          : [];
        local_cart.push(new_purchase);
        localStorage.setItem("cart", JSON.stringify(local_cart));
      }

    } else {
      alert("Must provide a number");
    }
  };

  return (
    <div  className="container my-5">
      {isLoading ? (
            <div className="d-flex justify-content-center">
            <Spinner animation="border" role="status" style={{margin:"10%"}}>
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
      ) : (
        <div className="row">
          <div className="col-md-6">
            <img
            style={{backgroundColor:"red"}}
              src={product.product_image}
              alt=""
              className="img-fluid mb-3"
            />
            <p className="text-muted">Category: {product.product_category}</p>
          </div>
          <div className="col-md-6">
            <h2 className="mb-3">{product.product_name}</h2>
            <p className="lead">{product.product_description}</p>
            <hr />
            <div style={{ display: "flex", flexDirection: "column" }}>
              <p className="mb-0">
                Price: $
                {product.product_price * quantity || product.product_price}
              </p>
              <input
                onChange={(e) => setQuantity(e.target.value)}
                type="number"
                min="1"
                max="100"
                defaultValue="1"
                style={{ width: "60px", marginTop: "3%" }}
              />
              <Button
                onClick={(e) => addToCart(e, product)}
                variant="primary"
                className="mt-3"
                size="sm"
                style={{ marginBottom: "4%" }}
              >
                <FaShoppingCart onClick={addToCart} className="mr-1" />
                Add to Cart
              </Button>
            </div>
          </div>
        </div>
      )}
      <Button onClick={() => navigate(-1)} variant="secondary">
        Back
      </Button>
    </div>
  );
};

export default OneProduct;
