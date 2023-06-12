import React from 'react';
import { Outlet, useOutlet } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import ManagerNavbar from './ManagerNavbar';
import styles from '../../styles/Manager.module.css';

const Manager = () => {
  const outlet = useOutlet();

  return (
    <Container fluid className={styles.costume_container}>
      <ManagerNavbar />
      {outlet ? (
        <Outlet  />
      ) : (
        <Row className="justify-content-center align-items-center" style={{ height: '100vh' }}>
          <Col xs={6} className="text-center">
            <h2>Welcome back manager</h2>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default Manager;
