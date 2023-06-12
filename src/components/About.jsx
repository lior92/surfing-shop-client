import React from "react";
import { Container, Row, Col, Image } from "react-bootstrap";
import myImage from "../images/about_img.jpg";
import styles from "../styles/About.module.css";

const About = () => {
  return (
    <Container className={styles.container}>
      <Row>
        <Col md={6}>
          <Image src={myImage} thumbnail />
        </Col>
        <Col md={6}>
          <h1>About Us</h1>
          <p className={styles.summary}>
            Welcome to our online store for kitesurfing gear! We're a team of
            passionate kitesurfers who want to share our love for the sport with
            the world. Our mission is to provide high-quality gear that will
            help you get the most out of your kitesurfing experience. Whether
            you're a beginner or a pro, we have everything you need to hit the
            waves and take your skills to the next level. We're dedicated to
            providing top-notch customer service and supporting the kitesurfing
            community. Thank you for choosing us as your go-to source for
            kitesurfing gear!
          </p>
        </Col>
      </Row>
    </Container>
  );
};

export default About;
