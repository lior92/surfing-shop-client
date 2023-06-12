import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useCookies } from "react-cookie";

import { useNavigate, useParams } from "react-router-dom";
import { contextData } from "../../App";
import { Button, Form,Spinner } from "react-bootstrap";
import styles from "../../styles/Manager_user.module.css";
import useAxiosFetch from "../../useGetRequest";

const User = () => {

  const [cookies, setCookies, removeCookies] = useCookies(['token']);


  //ContextData
  const currentUserDetails = useContext(contextData).currentUserDetails;

    //Hooks
    const { user_id } = useParams();
    const navigate = useNavigate();


    const {data:user,isLoading}=useAxiosFetch(
      `http://localhost:4000/users/get_user/${user_id}`,
    'user',
    )
    
      //States
  const [flag, setFlag] = useState(false);

  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [userAddress, setUserAddress] = useState("");
  const [userPermission, setUserPermission] = useState("");
  


  //Functions

  useEffect(() => {

if(user&&!isLoading){
  setUserName(user.user_name);
  setUserAddress(user.user_address);
  setUserEmail(user.user_email);
  setUserPermission(user.user_permission);
  setUserPhone(user.user_phone);
}

//Base on user object
  }, [user]);




  //Edit user
  const editAccount = (e) => {
    e.preventDefault();
    setFlag(!flag);

    const data = {
      user_id: user_id,
      user_name: userName || user.user_name,
      user_email: userEmail || user.user_email,
      user_phone: userPhone || user.user_phone,
      user_address: userAddress || user.user_address,
      user_permission: userPermission || user.user_permission,
    };


    axios
      .put("http://localhost:4000/users/update_user", data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookies.token}`,
        }
      })
      .then((response) => {
        if (response.data.success) {
          navigate("/manager/users");
        }
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
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${cookies.token}`,
          },
          data: {
            user_id: user_id,
          },
        })
        .then((response) => {
          if (response.data.success) {

            //Delete the user chat also
            axios
            .delete("http://localhost:4000/manager_area/delete_chat", {
              Authorization: `Bearer ${cookies.token}`,
              data: {
                user_id: user_id,
              },
            })
            .then((response) => {
            //If the manager has been deleted
            if (currentUserDetails._id == user_id) {
              document.cookie =
                "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
              localStorage.clear();
              navigate("/");
              window.location.reload();
            }
            })


            //else delete and go back
            navigate(-1);
          }
        })
        .catch((err) => console.error(err));
    }
  };

  return (
    <div style={{ textAlign: "center",marginTop:"10%"}}>
 {isLoading &&        <Spinner animation="border" role="status" >
          <span className="visually-hidden">Loading...</span>
        </Spinner>}
{user &&  !flag &&(
  <div>
    <p>Name: {userName}</p>
    <p>Address: {userAddress}</p>
    <p>Phone: {userPhone}</p>
    <p>Email: {userEmail}</p>
    <p>Permission: {userPermission}</p>
  </div>
)}

{/* Buttons */}

{!isLoading&&(
  <>
    <Button
        style={{ margin: "5px" }}
        variant="secondary"
        size="sm"
        onClick={() => setFlag(!flag)}
      >
        Edit
      </Button>
      <Button
        style={{ margin: "5px" }}
        variant="secondary"
        size="sm"
        onClick={deleteAccount}
      >
        Delete
      </Button>
      <Button
        style={{ margin: "5px" }}
        variant="secondary"
        size="sm"
        onClick={() => navigate(-1)}
      >
        Back
      </Button>
      <Button
        style={{ margin: "5px" }}
        variant="secondary"
        size="sm"
        onClick={() => navigate(`/manager/user/user_orders/${user_id}`)}
      >
        User Orders
      </Button>
  </>
)}
    

{/*Edit form */}
      {flag &&   (
        <Form className={styles.edit_form} onSubmit={editAccount}>
          <Form.Group>
            <Form.Label>New name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>New email</Form.Label>
            <Form.Control
              type="text"
              placeholder="Email"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>New phone</Form.Label>
            <Form.Control
              type="text"
              placeholder="Phone"
              value={userPhone}
              onChange={(e) => setUserPhone(e.target.value)}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>New address</Form.Label>
            <Form.Control
              type="text"
              placeholder="Address"
              value={userAddress}
              onChange={(e) => setUserAddress(e.target.value)}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>User permission</Form.Label>
            <Form.Control
              type="text"
              placeholder="User permission"
              value={userPermission}
              onChange={(e) => setUserPermission(e.target.value)}
            />
          </Form.Group>

          <Button variant="success" type="submit">
            Submit
          </Button>
        </Form>
      )}
    </div>
  );
};

export default User;
