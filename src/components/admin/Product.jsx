import axios from "axios";
import { useCookies } from "react-cookie";


import EditorNavBar from "../editor/EditorNavBar";
import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Form, Button, Image } from "react-bootstrap";
import styles from "../../styles/Manager_product.module.css";
import useAxiosFetch from "../../useGetRequest";
import { contextData } from "../../App";
import { async } from "q";

//!The component is used by the editor as well
const Product = () => {
  const [cookies, serCookies, removeCookies] = useCookies(["token"]);

  //ContextData
  const { currentUserDetails } = useContext(contextData);

  // get the product_id param
  const { product_id } = useParams();

  const navigate = useNavigate();

  //useAxiosFetch get product
  const { data: product, isLoading } = useAxiosFetch(
    `http://localhost:4000/products/get_by_id/${product_id}`,
    "product"
  );

  const [product_price, setProductPrice] = useState(0);
  const [product_name, setProductName] = useState("");
  const [product_category, setProductCategory] = useState("");
  const [product_description, setProductDescription] = useState("");

  //Functions

  useEffect(() => {
    if (!isLoading && product) {
      setProductPrice(product.product_price);
      setProductName(product.product_name);
      setProductCategory(product.product_category);
      setProductDescription(product.product_description);
    }
  }, [product]);



  //Edit Product
  const editProduct = async (e) => {
    e.preventDefault();
  
    const imageFile = e.target.imag_input.files[0];
    let product_image = "";
  
    const requestBody = {
      product_image:product.product_image,
      product_price,
      product_name,
      product_description,
      product_category,
    };
  
    if (imageFile) {
      try {
        const reader = new FileReader();
        reader.readAsDataURL(imageFile);
        reader.onload = () => {
          product_image = reader.result;
          // console.log(product_image); // Access the product_image variable here
  
          requestBody.product_image = product_image;
  
          axios
            .put(`http://localhost:4000/products/update/${product_id}`, requestBody, {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${cookies.token}`,
              },
            })
            .then((response) => {
              if (response.data.success) {
                alert("Product updated successfully");
                navigate(-1);
              }
            })
            .catch((error) => {
              console.log("Failed to update product:", error);
              alert("Failed to update product");
            });
        };
        reader.onerror = (error) => {
          console.log("Failed to read file as data URL:", error);
        };
      } catch (error) {
        console.log("Failed to read file as data URL:", error);
      }
    } else {
      axios
        .put(`http://localhost:4000/products/update/${product_id}`, requestBody, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${cookies.token}`,
          },
        })
        .then((response) => {
          if (response.data.success) {
            alert("Product updated successfully");
            navigate(-1);
          }
        })
        .catch((error) => {
          console.log("Failed to update product:", error);
          alert("Failed to update product");
        });
    }
  };
  
  //Remove product
  const removeProduct = (e) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete product?"
    );

    if (confirmDelete) {
      axios
        .delete(`http://localhost:4000/products/delete/${product_id}`, {
          withCredentials: true,
          data: {
            product_id: product_id,
          },    
           headers: {
            Authorization: `Bearer ${cookies.token}`
          }
        })
        .then((response) => {
          console.log(response);
          if (response.data.success) {
            navigate(-1);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  return (
    <div style={{ width: "100%" }}>
      {/* Editor nav bar */}
      {currentUserDetails.user_permission == 2 && <EditorNavBar />}
      {isLoading ? (
        <p>Loading..</p>
      ) : (
        <div className={styles.product_main}>
          <Image src={product.product_image} alt="" fluid />
          <Form onSubmit={editProduct}>

          <Form.Group controlId="product_image">
                <Form.Label>Image</Form.Label>
                <Form.Control name="imag_input" type="file" accept="image/*" />
              </Form.Group>


            <Form.Group>
              <Form.Label>New Price:</Form.Label>
              <Form.Control
                type="number"
                onChange={(e) => setProductPrice(e.target.value)}
                value={product_price}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>New Name:</Form.Label>
              <Form.Control
                type="text"
                onChange={(e) => setProductName(e.target.value)}
                value={product_name}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>New Category:</Form.Label>
              <Form.Control
                type="text"
                onChange={(e) => setProductCategory(e.target.value)}
                value={product_category}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>New Description:</Form.Label>
              <Form.Control
                as="textarea"
                style={{ resize: "none" }}
                type="text"
                onChange={(e) => setProductDescription(e.target.value)}
                value={product_description}
              />
            </Form.Group>
            <Button className={styles.modify_btn} type="submit">
              Modify
            </Button>
            <Button
              className={styles.remove_btn}
              variant="danger"
              onClick={(e) => removeProduct(e.target.value)}
            >
              Remove
            </Button>
          </Form>
        </div>
      )}
    </div>
  );
};

export default Product;
