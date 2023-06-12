import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Form,
  Button,
  ListGroup,
  ListGroupItem,
  Spinner,
} from "react-bootstrap";
import styles from "../../styles/Manager_users_main.module.css";
import { contextData } from "../../App";
import useAxiosFetch from "../../useGetRequest";
import usePostRequest from "../../usePostRequest";

const Users = () => {
  //States
  const [allUsers, setAllUsers] = useState([]);
  const [flag, setFlag] = useState(true);

  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [userAddress, setUserAddress] = useState("");
  const [userPermission, setUserPermission] = useState(1);

  //Hooks

  //Post usePostRequest hook
  const postUrl = "http://localhost:4000/manager_area/add_user";
  const { executePostRequest } = usePostRequest(postUrl);

  //Get useAxiosFetch hook
  const {
    data: users,
    isLoading,
    error,
  } = useAxiosFetch("http://localhost:4000/users/all_users", "users");

  //First the state when users updates/open the page
  useEffect(() => {
    setAllUsers(users);
    if (!isLoading) {
      console.log(error);
    }
  }, [users, isLoading]);

  //Add new user
  const addUser = async (e) => {
    e.preventDefault();

    //Open form
    setFlag(!flag);

    if (
      userName === "" ||
      userEmail === "" ||
      userPassword === "" ||
      userPhone === "" ||
      userAddress === "" ||
      userPermission === ""
    ) {
      alert("Please enter all required fields");
      return;
    }

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!passwordRegex.test(userPassword)) {
      alert(
        "Password must contain at least 8 characters, including at least one letter and one number."
      );
      return;
    }

    const phoneRegex = /^(\+)?(?:[0-9] ?){6,14}[0-9]$/;
    if (!phoneRegex.test(userPhone)) {
      alert(
        "Please enter a valid phone number in the format +123456789012 or 123456789012."
      );
      return;
    }

    const postData = {
      user_name: userName,
      user_email: userEmail,
      user_password: userPassword,
      user_phone: userPhone,
      user_address: userAddress,
      user_permission: userPermission,
    };

    //Send data to server through usePostRequest custom hook
    const response = await executePostRequest(postData);

    if (response.success) {
      setAllUsers([...allUsers, response.user]);
    }
    if (response.error) {
      console.log(response);
    }
  };

  let display_users = (
    <ListGroup className="justify-content-center d-flex">
      {allUsers ? (
        allUsers.map((user) => {
          return (
            <ListGroupItem key={user._id}>
              user name:{" "}
              <Link to={`/manager/users/user/${user._id}`}>
                {" "}
                {user.user_name}
              </Link>
            </ListGroupItem>
          );
        })
      ) : (
        <p>no users</p>
      )}
    </ListGroup>
  );

  const displayForm = (
    <Form className={styles.modify_form} onSubmit={addUser}>
      <Form.Group>
        <Form.Label>Name:</Form.Label>
        <Form.Control
          onChange={(e) => setUserName(e.target.value)}
          placeholder="name"
          type="text"
          value={userName}
        />
      </Form.Group>

      <Form.Group>
        <Form.Label>Email:</Form.Label>
        <Form.Control
          onChange={(e) => setUserEmail(e.target.value)}
          placeholder="email"
          type="text"
          value={userEmail}
        />
      </Form.Group>

      <Form.Group>
        <Form.Label>Phone:</Form.Label>
        <Form.Control
          onChange={(e) => setUserPhone(e.target.value)}
          placeholder="user phone"
          type="text"
          value={userPhone}
        />
      </Form.Group>

      <Form.Group>
        <Form.Label>Address:</Form.Label>
        <Form.Control
          onChange={(e) => setUserAddress(e.target.value)}
          placeholder="user address"
          type="text"
          value={userAddress}
        />
      </Form.Group>

      <Form.Group>
        <Form.Label>Password:</Form.Label>
        <Form.Control
          onChange={(e) => setUserPassword(e.target.value)}
          placeholder="password"
          type="password"
          value={userPassword}
        />
      </Form.Group>

      <Form.Group>
        <Form.Label>User permission:</Form.Label>
        <Form.Control
          onChange={(e) => setUserPermission(e.target.value)}
          placeholder="user permission"
          type="text"
          value={userPermission}
        />
      </Form.Group>

      <Button style={{ margin: "15%" }} variant="primary" type="submit">
        Add user
      </Button>
    </Form>
  );

  return (
    <div
      className={`d-flex justify-content-center ${styles.manager_users_main}`}
    >
      <ul>
        {!flag ? (
          <Button
            variant="secondary"
            style={{ marginBottom: "5%" }}
            onClick={(e) => setFlag(!flag)}
          >
            back
          </Button>
        ) : (
          <Button
            style={{ marginBottom: "15%" }}
            onClick={(e) => setFlag(!flag)}
          >
            Add user
          </Button>
        )}
        {!isLoading ? (
          !flag && displayForm
        ) : (
          <Spinner animation="border" role="status" style={{ margin: "5%" }}>
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        )}
        {flag && display_users}
      </ul>
    </div>
  );
};

export default Users;
