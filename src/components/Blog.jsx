import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import styles from '../styles/Blog.module.css';
import chooseGearImage from '../images/choose_gear.jpg';
import bestSpotsImage from '../images/best_spots.jpg';
import eventCalendarImage from '../images/Matchu.jpg';

const BlogPage = () => {
  const blogPosts = [
    {
      id: 1,
      title: 'How to choose kitesurfing gear in 5 easy steps!',
      date: 'March 18, 2023',
      content: ' In this article, we will take you through 5 steps that you should consider when buying kitesurfing equipment..',
      image: chooseGearImage,
      link: 'https://freeyourmindexperience.com/how-to-choose-kitesurfing-gear-in-5-easy-steps/'
    },
    {
      id: 2,
      title: 'The Ultimate Guide to the 10 Best Kiteboarding Spots Worldwide',
      author: 'Miriam Tymiec',
      date: 'March 21, 2023',
      content: 'If you are looking for the ultimate kiteboarding adventure, look no further than these top 10 kiteboarding spots around the world...',
      image: bestSpotsImage,
      link: 'https://57hours.com/best-of/kiteboarding-locations-worldwide/'
    },
    {
      id: 3,
      title: '2023 Event Calendar Launched',
      author:'Jim Gaunt',
      date: 'December 22, 2022',
      content: 'Stay informed on major international and national events across kitesurfing, freestyle, big-air, foiling and snowkiting....',
      image: eventCalendarImage,
      link: 'https://www.gkakiteworldtour.com/2023-event-calendar-launched/'
    },

    // Add more blog posts as needed
  ];

  return (
    <Container className={styles.container}>
      <Row className="mt-5">
        <Col>
          <h1>Our Blog</h1>
          <p>Welcome to our blog where we share the latest news, tips, and stories about kiteboarding and other water sports.</p>
        </Col>
        
      </Row>
      <Row className="mt-5">
        {blogPosts.map(post => (
          <Col md={4} key={post.id}>
            <Card className="mb-3">
              {post.image && <Card.Img variant="top" src={post.image} />}
              <Card.Body>
                <Card.Title>{post.title}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">{post.author} | {post.date}</Card.Subtitle>
                <Card.Text>{post.content}</Card.Text>
                <Button variant="primary" href={post.link} target="_blank" >Read more</Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default BlogPage;
