import axios from "axios";
import { useCookies } from "react-cookie";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Form,Spinner } from "react-bootstrap";
import styles from "../styles/Client_support.module.css";
import useAxiosFetch from "../useGetRequest";
import usePostRequest from "../usePostRequest";

const Support = () => {

  const [cookies, setCookies, removeCookies] = useCookies(['token']);

  //States

  //input value
  const [message, setMessage] = useState("");
  //chat from database/manager
  const [chat, setChat] = useState("");
  //chat status from database/manager
  const [status, setStatus] = useState("Open chat");

  //Hooks
  const navigate = useNavigate();

  //Chat from useAxiosFetch hook
  // First get the chat conversation (confirm the user with token on server side)
  const {
    data: my_chat,
    isLoading,
    error,
  } = useAxiosFetch("http://localhost:4000/client_support/get_msg", "my_chat");

  
  const postUrl = "http://localhost:4000/client_support/send_msg"
  //Destructing executePostRequest function from usePostRequest + send the url for post request
  const {executePostRequest} = usePostRequest(postUrl)


  //Functions

  //Update the states with response from useAxiosFetch hook
  useEffect(() => {
    if (my_chat && !isLoading) {
      if (my_chat.length > 0) {
        setChat(my_chat[0].message);
        setStatus(my_chat[0].chat_status);
      }
    }
    // Check token validation
    if (error) {
      if (error.response.data.error == "jwt expired") {
        alert("Sorry, your time is finished! Please login again");
        navigate("/");
        window.location.reload();
      }
    }
  }, [my_chat, error]);


  //Send message
  const sendMsg = async (e) => {
    e.preventDefault();

    const postData = {
      message: message,
      chat_status: status,
    };

   //Await to response from the usePostRequest hook
   const response = await executePostRequest(postData);

        if (response.success) {
          alert("The support team will respond back as soon as possible");
          //!!here surge fulling
          window.location.reload();
        }
        else{
          alert(response.message)
        }
  };

  //Delete chat
  const deleteChat = () => {
    //Ask before deleting
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this chat?"
    );

    if (confirmDelete) {
      axios.delete("http://localhost:4000/client_support/delete_chat", {
  headers: {
    Authorization: `Bearer ${cookies.token}`
  }
})
        .then((response) => {
          if (response.data.success) {
            navigate("/");
            //!maybe i need to reload
          }
        })
        .catch((err) => console.error(err));
    }
  };


  return (
    <div className={styles.support_main}>
      <div>
        <h4>Support Area</h4>
        <Form onSubmit={sendMsg}>
          <Form.Group>
            <Form.Label>Type your message:</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              style={{ height: "auto", resize: "none", width: "80%" }}
              onChange={(e) => setMessage(e.target.value)}
            />
          </Form.Group>
          <Button className={styles.send_btn} variant="primary" type="submit">
            Send
          </Button>
        </Form>
      </div>
      {isLoading ? (
        <Spinner animation="border" variant="primary" style={{margin:"5%"}} />
      ) : (
        <div>
          <hr />
          <h5>Chat history</h5>
{chat&&   <Button
            className={styles.delete_button}
            variant="outline-danger"
            size="sm"
            onClick={deleteChat}
          >
            Delete chat
          </Button>}

       
          <div dangerouslySetInnerHTML={{ __html: chat }}></div>
          <hr />
          {  chat &&  (

           status === "Open chat" ? (
            <div style={{ color: "green" }}>Chat is open</div>
          ) : (
            <div style={{ color: "red" }}>Chat is closed</div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Support;
