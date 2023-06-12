import React, { useContext, useState } from "react";
import EditorNavBar from "../editor/EditorNavBar";
import { Link } from "react-router-dom";
import { Form, Card, Button, Container, Row, Col,Spinner } from "react-bootstrap";
import styles from "../../styles/Manager_products.module.css";
import useAxiosFetch from "../../useGetRequest";
import usePostRequest from "../../usePostRequest";
import { contextData } from "../../App";
import imageCompression from 'browser-image-compression';

//!The component is used by the editor as well
const Products = () => {
  //ContextData
  const { currentUserDetails } = useContext(contextData);

  //Hooks

  //useAxiosFetch get products
  const { data: products, isLoading } = useAxiosFetch(
    `http://localhost:4000/products/all_products`,
    "products"
  );

  //Post requests custom hook function
  const postUrl = "http://localhost:4000/products/add_product";
  const { executePostRequest } = usePostRequest(postUrl);

  //state
  const [searchTxt, setSearchTxt] = useState("");

  //For creating new product
  const [product_price, setProductPrice] = useState(0);
  const [product_name, setProductName] = useState("");
  const [product_category, setProductCategory] = useState("");
  const [product_description, setProductDescription] = useState("");
  

  //Add AddProduct
  const AddProduct = async (e) => {
    e.preventDefault();
    

    if (!e.target.imag_input.files[0]) {
      alert("Must provide all fields");
      return;
    }

    const imageFile = e.target.imag_input.files[0];
    const options = {
      maxSizeMB: 0.3,
      maxWidthOrHeight: 500
    };
    
    try {
      const compressedFile = await imageCompression(imageFile, options);
      const compressedSize = compressedFile.size / 1024 / 1024;
      console.log(`Compressed file size: ${compressedSize} MB`);
  
      const reader = new FileReader();
      reader.readAsDataURL(compressedFile);
      reader.onloadend = async () => {
        const base64data = reader.result;
  


        const requestBody = {
          product_image: base64data,
          product_price,
          product_name,
          product_description,
          product_category,
        };
  
        if (
          product_price === "" ||
          product_name === "" ||
          product_description === "" ||
          product_category === ""
        ) {
          alert("Must provide all fields");
          setProductDescription("");
          setProductCategory("");
          setProductName("");
          setProductPrice("");
          return;
        }
    
        try {
          const response = await executePostRequest(requestBody);
          console.log(response)
          // Reload to see the changes
          window.location.reload();
        } catch (error) {
          console.log(error);
        }
      };
    } catch (error) {
      console.log(error);
    }
  };

  // Sort the array by category's
  let sorted_by_category = null;
  if (!isLoading && products) {
    //Only if all ready
    sorted_by_category = products.sort((a, b) => {
      if (a.product_category < b.product_category) {
        return -1;
      }
      if (a.product_category > b.product_category) {
        return 1;
      }
      return 0;
    });
  }

  // JSX
  let display_input_results = (
    <div className={styles.display_input_results}>
      {/* If empty show all */}
      {searchTxt === "" &&
        sorted_by_category &&
        sorted_by_category.map((product) => (
          <Card
            className={styles.card}
            key={product._id}
            style={{ width: "8rem", margin: "0.5rem" }}
          >
            <Card.Img
              variant="top"
              src={product.product_image}
              style={{ width: "100px" }}
            />
            <Card.Body className={styles.card_body}>
              <Card.Title>{product.product_name}</Card.Title>
              <Card.Text>{product.product_description}</Card.Text>
              <Card.Text>Price: {product.product_price}</Card.Text>
              <Link
                to={
                  currentUserDetails.user_permission == 3
                    ? `/manager/product/${product._id}`
                    : `/editor/${product._id}`
                }
              >
                <Button variant="primary">Edit</Button>
              </Link>
            </Card.Body>
          </Card>
        ))}

      {/* Else show filtered products */}
      {searchTxt !== "" &&
        sorted_by_category &&
        sorted_by_category.map((product) => {
          if (product.product_name.toLowerCase().startsWith(searchTxt)) {
            return (
              <Card
                className={styles.card}
                key={product._id}
                style={{ width: "8rem", margin: "0.5rem" }}
              >
                <Card.Img
                  variant="top"
                  src={product.product_image}
                  style={{ width: "100px" }}
                />
                <Card.Body className={styles.card_body}>
                  <Card.Title>{product.product_name}</Card.Title>
                  <Card.Text>{product.product_description}</Card.Text>
                  <Card.Text>Price: {product.product_price}</Card.Text>
                  <Link
                    to={
                      currentUserDetails.user_permission == 3
                        ? `/manager/product/${product._id}`
                        : `/editor/${product._id}`
                    }
                  >
                    <Button size="sm" variant="primary">
                      Edit
                    </Button>
                  </Link>
                </Card.Body>
              </Card>
            );
          }
        })}
    </div>
  );

  //!MAKE LOG OUT

  return (
    <div className={styles.products_main}>
      {/* Editor nav bar */}
      {currentUserDetails.user_permission == 2 && <EditorNavBar />}

      {/* Form to add new product */}
      <Container
        className={`${styles.form_container} d-flex align-items-center justify-content-center`}
        style={{ marginTop: "70px" }}
      >
        <Row className="justify-content-md-center">
          <Col xs={12} md={6} lg={12}>
            <Form onSubmit={AddProduct}>


              <Form.Group controlId="product_image">
                <Form.Label>Image</Form.Label>
                <Form.Control name="imag_input" type="file" accept="image/*" />
              </Form.Group>


              <Form.Group controlId="product_name">
                <Form.Control
                  placeholder="name.."
                  type="text"
                  value={product_name}
                  onChange={(e) => setProductName(e.target.value)}
                />
              </Form.Group>
              <Form.Group controlId="product_category">
                <Form.Control
                  placeholder="category"
                  type="text"
                  value={product_category}
                  onChange={(e) => setProductCategory(e.target.value)}
                />
              </Form.Group>
              <Form.Group controlId="product_price">
                <Form.Control
                  placeholder="price"
                  type="number"
                  value={product_price}
                  onChange={(e) => setProductPrice(e.target.value)}
                />
              </Form.Group>
              <Form.Group controlId="product_description">
                <Form.Control
                  placeholder="product description"
                  as="textarea"
                  style={{ resize: "none" }}
                  value={product_description}
                  onChange={(e) => setProductDescription(e.target.value)}
                />
              </Form.Group>
              <Button className={styles.addBtn} variant="primary" type="submit">
                Add
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>

      {/* Search field */}
      <Container
        style={{ width: "50%", marginTop: "4%", marginBottom: "3%" }}
        className="d-flex justify-content-center"
      >
        <Form.Control
          type="text"
          placeholder="Search..."
          onChange={(e) => setSearchTxt(e.target.value)}
        />
      </Container>

      {/* All product + search result */}
      {isLoading ?     
           <div style={{ display: "flex", justifyContent: "center" }}>
           <Spinner animation="border" role="status">
             <span className="visually-hidden">Loading...</span>
           </Spinner>
         </div> 
         :
          <div>{display_input_results}</div>}
    </div>
  );
};

export default Products;
