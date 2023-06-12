import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Container, Form } from "react-bootstrap";
import { useCookies } from "react-cookie";
import styles from "../../styles/Manager_support_chat.module.css";
import useAxiosFetch from "../../useGetRequest";
import usePostRequest from "../../usePostRequest";

const UserChat = () => {
  const [cookies, setCookies, removeCookies] = useCookies(['token']);
  const [chat, setChat] = useState([]);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  
  //Hooks
  const { user_id } = useParams();
  const navigate = useNavigate();

  //Post request custom hook
  const postUrl = "http://localhost:4000/manager_area/support";
  const { executePostRequest } = usePostRequest(postUrl);

  //First make get request to all users messages and take the relevant to this user
  //useAxiosFetch get all messages
  const { data: all_users, isLoading } = useAxiosFetch(
    "http://localhost:4000/manager_area/support",
    "all_users"
  );
//=>
  useEffect(() => {
    if (all_users != null) {
      let filteredMessages = all_users.filter(
        (message) => message.user_id == user_id
      );
      setChat(filteredMessages[0].message);
      setStatus(filteredMessages[0].chat_status);
    }
  }, [all_users]);


  //Send message back to the client
  const sendMsgBack = async (e) => {
    let input_text = e.target.previousElementSibling.value;

    const postData = {
      user_id: user_id,
      message: input_text,
      chat_status: status,
    };

    const response = await executePostRequest(postData);

    if (response.success) {
      setMessage(response.chat.message);
    }
    if (response.error) {
      console.log(response.error);
    }
    //Reset the  input field
    e.target.previousElementSibling.value = "";
  };

  //Delete chat
  const deleteChat = () => {
    //Ask before deleting
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this chat?"
    );

    if (confirmDelete) {
      axios
        .delete("http://localhost:4000/manager_area/delete_chat", {
          Authorization: `Bearer ${cookies.token}`,
          data: {
            user_id: user_id,
          },
        })
        .then((response) => {
          if (response.data.success) {
            navigate(-1);
          }
        })
        .catch((err) => console.error(err));
    }
  };

  //Change chat status
  const changeChatStatus = () => {
    //Create variable because the data don't have enough time to update from state change
    let chat_status = "";

    if (status == "Open chat") {
      setStatus("Closed chat");
      chat_status = "Closed chat";
    } else {
      setStatus("Open chat");
      chat_status = "Open chat";
    }

    const data = {
      user_id: user_id,
      chat_status: chat_status,
    };

    axios
      .put("http://localhost:4000/manager_area/change_status", data, {
        Authorization: `Bearer ${cookies.token}`,
      })
      .then((response) => {
        if (response.data.success) {
          // window.location.reload()
        }
        // console.log(response.data.updated_user.chat_status)
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <Container
          className={styles.manager_chat_main}
          style={{ marginTop: "5%", marginBottom: "5%" }}
        >
          <Button
            variant="secondary"
            style={{ marginBottom: "5%" }}
            onClick={() => navigate(-1)}
          >
            back
          </Button>
          {chat.length > 0 ? (
            <div>
              <Button variant="danger" onClick={deleteChat}>
                Delete chat
              </Button>
              <div className={`p-3 ${styles.messages_div}`}>
                <div
                  dangerouslySetInnerHTML={{ __html: message || chat }}
                ></div>
                <Form
                  className={`${styles.text_field} d-flex align-items-center`}
                >
                  <Form.Control type="text" placeholder="me" />
                  <Button
                    style={{ marginLeft: "2%" }}
                    variant="primary"
                    onClick={(e) => sendMsgBack(e)}
                  >
                    send
                  </Button>
                </Form>
              </div>
              <span>Status:</span>{" "}
              <p style={{ color: status === "Open chat" ? "green" : "red" }}>
                {" "}
                {status}
              </p>{" "}
              <Button variant="secondary" onClick={(e) => changeChatStatus(e)}>
                {status == "Open chat" ? "close" : "open"}
              </Button>
            </div>
          ) : (
            <p>No chat to show</p>
          )}
        </Container>
      )}
    </div>
  );
};

export default UserChat;
