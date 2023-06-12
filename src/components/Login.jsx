import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import styles from "../styles/Login.module.css";
import { useContext } from "react";
import { contextData } from "../App";
import usePostRequest from "../usePostRequest";

const Login = () => {
  //contextData
  const { setCurrentUser, currentUserDetails } = useContext(contextData);

  //States
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");

  //Hooks
  const navigate = useNavigate();

  const postUrl = "http://localhost:4000/users/login";
  const { executePostRequest } = usePostRequest(postUrl);

  //Prevent manager/editor comes back to Login page after they logged, this will throw them back to their page , the only way is to press logOut button in Manager/editor

  useEffect(()=>{
    if (currentUserDetails.user_permission == 3) {
      console.log('true')
      navigate("/manager");
    }
    if (currentUserDetails.user_permission == 2) {
      navigate("/editor");
    }

  },[])

  const Login = async (e) => {
    e.preventDefault();

    //Delete any existing cookies and localStorage
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    localStorage.clear();

    const postData = {
      user_email: userEmail,
      user_password: userPassword,
    };
    //Get the response from the server through the custom post hook
    const response = await executePostRequest(postData);




    if (response.success) {
      //Save the token in the cookie and destroy after 1 hour
      document.cookie = `token=${response.token}; expires=${new Date(
        Date.now() + 3600000
      ).toUTCString()}; path=/`;

      //Update the current user that was logged in
      setCurrentUser(response.user);

      //Log out automatically after one hour
      setTimeout(() => {
        alert("Sorry, your time is finished! Please login again");
        localStorage.clear();
        document.cookie =
          "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        navigate("/");
        window.location.reload();
      }, 3600000);

      // if manager redirect to /manager
      if (response.user.user_permission == 3) {
        navigate("/manager");
      }
      //if editor redirect to /editor
      else if (response.user.user_permission == 2) {
        navigate("/editor");
      }
      // redirect to home
      else {
        navigate("/");
      }
    }


    
    //Error handling
    
    if(response.response.data.error){
      alert(response.response.data.error)
      setUserEmail("");
      setUserPassword("");
      return;
    }

  };

  return (
    <Container className={styles.login_container} fluid>
      <Row className="justify-content-center mt-4">
        <Col style={{ textAlign: "center" }} xs={12} md={6} lg={4}>
          <h2>Login</h2>
          <Form onSubmit={Login}>
            <Form.Group controlId="user_email">
              <Form.Control
                type="text"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                placeholder="email"
                style={{ marginBottom: "5%" }}
              />
            </Form.Group>
            <Form.Group controlId="user_password">
              <Form.Control
                type="password"
                value={userPassword}
                onChange={(e) => setUserPassword(e.target.value)}
                placeholder="password"
                style={{ marginBottom: "5%" }}
              />
            </Form.Group>
            <Button variant="dark" type="submit" className={styles.login_btn}>
              Login
            </Button>
          </Form>
          <div className={`mt-2 text-center ${styles.bottom_div}`}>
            <Button variant="link" onClick={() => navigate("/register")}>
              Register
            </Button>

            <Button variant="link" onClick={() => navigate("/forgot_password")}>
              Forgot Password?
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
