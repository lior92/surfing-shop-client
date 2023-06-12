import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { FaFacebookF, FaTwitter, FaInstagram } from 'react-icons/fa';
import styles from './Footer.module.css'

function Footer() {
  return (
    <footer className={`bg-light py-3 ${styles.footer}`}   >
      <Container className={styles.container}>
        <Row className={styles.row}>
          <Col md={6}>
            <h4>About Our Company</h4>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean eget risus vitae nibh vestibulum lacinia.</p>
          </Col>
          <Col md={3}>
            <h4>Contact Us</h4>
            <p><i className="bi bi-geo-alt"></i>123 Main St, New York, NY 10001</p>
            <p><i className="bi bi-telephone"></i>+1 (555) 123-4567</p>
            <p><i className="bi bi-envelope"></i>info@company.com</p>
          </Col>
          <Col md={3}>
            <h4>Follow Us</h4>
            <li><a className={styles.facebook} href="https://www.facebook.com"><FaFacebookF /></a></li>
            <li><a className={styles.twitter} href="https://www.twitter.com"><FaTwitter /></a></li>
        <li><a className={styles.instagram} href="https://www.instagram.com"><FaInstagram /></a></li>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default Footer;