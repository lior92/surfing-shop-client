import React from "react";
import styles from "../styles/Forgot_password.module.css";
import { useNavigate } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import usePostRequest from "../usePostRequest";

const Forgot_password = () => {
  //Hooks
  const navigate = useNavigate();

  const postUrl = "http://localhost:4000/forgot_password";

  const { executePostRequest } = usePostRequest(postUrl);

  const sendRequestToGetPass = async (e) => {
    e.preventDefault();

    alert(
      "If the email address current you will get the password in the mail "
    );
    const postData = {
      user_email: e.target.elements.email.value,
    };

    //await to response from the usePostRequest hook
    const response = await executePostRequest(postData);
    navigate('/')
  };

  return (
    <div className={styles.forgot_pass_main}>
      <Form onSubmit={sendRequestToGetPass}>
        <Form.Group controlId="formEmail">
          <Form.Label>Your email:</Form.Label>
          <Form.Control name="email" type="text" />
        </Form.Group>
        <Button variant="primary" type="submit">
          Send
        </Button>
        <Button variant="secondary" onClick={() => navigate(-1)}>
          Back
        </Button>
      </Form>
    </div>
  );
};

export default Forgot_password;
