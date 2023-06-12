import React from 'react';
import  {  useNavigate,useLocation } from 'react-router-dom';
import { Navbar, Nav, Button } from 'react-bootstrap';
import styles from '../../styles/EditorNavBar.module.css'

function EditorNavBar() {

//Hooks
const navigate = useNavigate()
const location = useLocation()


  const logOut = () => {
    // delete the token by providing previous date
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    localStorage.clear()
    navigate('/');
    //Clear all the states 
    window.location.reload();
  };

  const navigateBack = ()=>{
    navigate(-1)
  }


  return (
    <Navbar bg="light" >

      <Nav className={styles.nav}>
        <Button   variant="outline-secondary" onClick={logOut}> 
          Log out
        </Button>
        {!location.pathname.endsWith("/editor")&&<Button  onClick={navigateBack}> 
          back
        </Button>}
    
      </Nav>
       
  </Navbar>
  )
}

export default EditorNavBar