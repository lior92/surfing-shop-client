import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Button } from 'react-bootstrap';
import { useState } from 'react';

const ManagerNavbar = () => {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);

  const logOut = () => {
    // delete the token by providing previous date
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    localStorage.clear()
    navigate('/');
    window.location.reload();
  };

  const handleNavItemClick = () => {
    setExpanded(false);
  };

  return (
    <Navbar bg="light" expand="lg" expanded={expanded}>
      <Navbar.Brand style={{ paddingLeft: '3%' }} href="#">
        Manager
      </Navbar.Brand>
      <Navbar.Toggle
       style={{marginRight:"3%"}}
        aria-controls="basic-navbar-nav"
        onClick={() => setExpanded(expanded ? false : 'expanded')}
      />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav  style={{paddingLeft:"3%"}} className="mr-auto">
          <NavLink
            className="nav-link"
            to="/manager/users"
            onClick={handleNavItemClick}
          >
            Users
          </NavLink>
          <NavLink
            className="nav-link"
            to="/manager/manager_support"
            onClick={handleNavItemClick}
          >
            Support
          </NavLink>
          <NavLink
            className="nav-link"
            to="/manager/products"
            onClick={handleNavItemClick}
          >
            Products
          </NavLink>
        </Nav>
        <Nav style={{width:"160px",paddingLeft:"3%" }} className="ml-auto">
          <Button   variant="outline-secondary" onClick={logOut}> 
            Log out
          </Button>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default ManagerNavbar;
