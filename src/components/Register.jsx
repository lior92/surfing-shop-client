import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import styles from '../styles/Register.module.css'
import usePostRequest from "../usePostRequest";
const Register = () => {
  //States

  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [userPasswordConfirm, setUserPasswordConfirm] = useState("");
  const [userAddress, setUserAddress] = useState("");

  //Hooks
  const navigate = useNavigate()
   

  //Custom hook for post request
  const postUrl = "http://localhost:4000/users/register"
  const {executePostRequest} = usePostRequest(postUrl)
   

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (userPassword !== userPasswordConfirm) {
      alert("Passwords do not match!");
      return;
    }
    const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!regex.test(userPassword)) {
      alert("Password must contain at least 8 characters, including at least one letter and one number.");
      return;
    }

    const phoneRegex = /^(\+)?(?:[0-9] ?){6,14}[0-9]$/;
    if (!phoneRegex.test(userPhone)) {
      alert("Please enter a valid phone number in the format +123456789012 or 123456789012.");
      return;
    }
    
    const postData = {
      user_name: userName,
      user_email: userEmail,
      user_password: userPassword,
      user_password_confirm: userPasswordConfirm,
      user_phone: userPhone,
      user_address: userAddress
    };

    const response = await executePostRequest(postData)

        if(response.success){
            navigate('/login')
        }
        console.log(response.message);
        console.log(response.error);
  };

  return (
    <Container className={styles.container}>
  <Row>
    <Col md={{ span: 6, offset: 3 }}>
      <h1>Register</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Control
          type="text"
          placeholder="Enter name"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />
        <br />
        <Form.Control
          type="email"
          placeholder="Enter email"
          value={userEmail}
          onChange={(e) => setUserEmail(e.target.value)}
        />
        <br />
        <Form.Control
          type="text"
          placeholder="Enter phone number"
          value={userPhone}
          onChange={(e) => setUserPhone(e.target.value)}
        />
        <br />
        <Form.Control
          type="text"
          placeholder="Enter address"
          value={userAddress}
          onChange={(e) => setUserAddress(e.target.value)}
        />
        <br />
        <Form.Control
          type="password"
          placeholder="Password"
          value={userPassword}
          onChange={(e) => setUserPassword(e.target.value)}
        />
        <br />
        <Form.Control
          type="password"
          placeholder="Confirm password"
          value={userPasswordConfirm}
          onChange={(e) => setUserPasswordConfirm(e.target.value)}
        />
        <br />
        <Button variant="dark" type="submit">
          Register
        </Button>
        <Button style={{marginLeft:'4%'}} variant="secondary" onClick={()=>navigate(-1)}>
          back 
        </Button>
      </Form>
    </Col>
  </Row>
</Container>

  );
};

export default Register;
