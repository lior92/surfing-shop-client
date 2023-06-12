import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import styles from '../../styles/Manager_support.module.css'
import { Container, ListGroup,Spinner } from 'react-bootstrap';
import useAxiosFetch from "../../useGetRequest";

const MangerSupport = () => {

const [users,setUsers] = useState([])

   //useAxiosFetch get all users
   const { data: all_users, isLoading } = useAxiosFetch(
    "http://localhost:4000/manager_area/support",
    "all_users",
  );


//get all users first
useEffect(()=>{
  if (all_users != null) {
    const users_chats = all_users.map((user) => user.user_id);
    setUsers(users_chats);
}
//Update the state only when get all messages 
},[all_users])



const displayUsers =  (
  <ListGroup> 
    {users.map((user,i) => (
      <ListGroup.Item key={i}>
      <p>Chat with: <Link to={`/manager/manager_chat/${user}`}> {user}</Link></p>
      </ListGroup.Item>
    ))}
  </ListGroup>
);

return (
  <div>
{isLoading?(
   <Spinner animation="border" role="status" style={{ margin: " auto 0" }}>
   <span className="visually-hidden">Loading...</span>
 </Spinner>
):(
<div>
    <h4 className={styles.page_title}>Manager Support</h4>
  <Container className={`d-flex justify-content-center ${styles.manager_users_main}`}>{displayUsers}</Container>
</div>
)}


</div>  
)
};
export default MangerSupport