import axios from "axios";
import React, { useState, useContext, useEffect } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { contextData } from "../App";

import { Button, Form, Spinner } from "react-bootstrap";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import styles from "../styles/UserDetails.module.css";

const UserDetails = () => {
  
  //contextData from App: current user connected (originally from Login)
  const { currentUserDetails, setCurrentUser } = useContext(contextData);
  
  //States
  const [cookies, setCookies, removeCookies] = useCookies(["token"]);
  const [flag, setFlag] = useState(false);
  const [loading, setLoading] = useState(true);

  const [userName, setUserName] = useState(currentUserDetails.user_name);
  const [userEmail, setUserEmail] = useState(currentUserDetails.user_email);
  const [userPhone, setUserPhone] = useState(currentUserDetails.user_phone);
  const [userAddress, setUserAddress] = useState(currentUserDetails.user_address);
  const [userPassword, setUserPassword] = useState(currentUserDetails.user_password);
  //*Not showing password because its not possible to decode bcrypt

  //Hooks
  const navigate = useNavigate();
  
  //Functions
  
  //Spinner controller
    useEffect(()=>{
      if(currentUserDetails){
        setLoading(false)
      }
    })

  //Edit user
  const editAccount = (e) => {
    e.preventDefault();
    setFlag(!flag);

    const data = {
      user_id: currentUserDetails._id,
      user_name: userName || currentUserDetails.user_name,
      user_email: userEmail || currentUserDetails.user_email,
      user_phone: userPhone || currentUserDetails.user_phone,
      user_address: userAddress || currentUserDetails.user_address,
      user_password: userPassword || currentUserDetails.user_password,
    };

    axios
      .put("http://localhost:4000/users/update_user", data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookies.token}`,
        },
      })
      .then((response) => {
        //Update currentUserDetails in App
        setCurrentUser(response.data.user);
      })
      .catch((err) => console.log(err));
  };

  //Delete user
  const deleteAccount = (e) => {
    e.preventDefault();

    //Ask before deleting
    const confirmDelete = window.confirm(
      "Are you sure you want to delete your account?"
    );

    if (confirmDelete) {
      axios
        .delete("http://localhost:4000/users/delete_user", {
          data: {
            user_id: currentUserDetails._id,
          },
          headers: {
            Authorization: `Bearer ${cookies.token}`,
          },
        })
        .then((response) => {
          if (response.data.success) {
            //Delete also the user chat
            axios
              .delete("http://localhost:4000/client_support/delete_chat", {
                headers: {
                  Authorization: `Bearer ${cookies.token}`,
                },
              })
              .then((response) => {
                if (response.data.success) {
                  document.cookie =
                    "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                  navigate("/");
                  window.location.reload();
                }
              })
              .catch((err) => console.error(err));
          }
        })
        .catch((err) => console.error(err));
    }
  };

  return (
    <div className={styles.user_details_main}>
{!flag && !loading ? (
  <div>
    <p>Name: {currentUserDetails.user_name}</p>
    <p>Address: {currentUserDetails.user_address}</p>
    <p>Phone: {currentUserDetails.user_phone}</p>
    <p>Email: {currentUserDetails.user_email}</p>
  </div>
) : (
  !flag && (
    <Spinner animation="border" role="status" style={{ margin: "5%" }}>
      <span className="visually-hidden">Loading...</span>
    </Spinner>
  )
)}

      <Button
        className={styles.edit_btn}
        onClick={() => setFlag(!flag)}
        variant="primary"
      >
        <FiEdit /> Edit
      </Button>

      <Button
        className={styles.delete_btn}
        onClick={deleteAccount}
        variant="danger"
      >
        <FiTrash2 /> Delete
      </Button>

      {flag && (
        <Form onSubmit={editAccount}>
          <Form.Group>
            <Form.Label>New name</Form.Label>
            <Form.Control
              onChange={(e) => setUserName(e.target.value)}
              type="text"
              placeholder="name"
              name="user_name"
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>New email</Form.Label>
            <Form.Control
              onChange={(e) => setUserEmail(e.target.value)}
              type="text"
              placeholder="email"
              name="user_email"
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>New phone</Form.Label>
            <Form.Control
              onChange={(e) => setUserPhone(e.target.value)}
              type="text"
              placeholder="phone"
              name="user_phone"
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>New address</Form.Label>
            <Form.Control
              onChange={(e) => setUserAddress(e.target.value)}
              type="text"
              placeholder="address"
              name="user_address"
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>New password</Form.Label>
            <Form.Control
              onChange={(e) => setUserPassword(e.target.value)}
              type="text"
              placeholder="password"
              name="user_password"
            />
          </Form.Group>
          <Button className={styles.submit_btn} type="submit" variant="primary">
            Submit
          </Button>
        </Form>
      )}
    </div>
  );
};

export default UserDetails;
