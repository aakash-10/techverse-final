// App.js
import React, { useContext, useState } from 'react';
import { Button, Container, Card, Row, Col, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCubes } from '@fortawesome/free-solid-svg-icons';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { Link } from "react-router-dom";
import { compareSync } from 'bcryptjs';
import { useNavigate } from 'react-router-dom';

import { ProductContext } from '../context/ProductContext';
import './Login.css'

function App() {
  const { register, handleSubmit } = useForm();
  const { isLoggedIn, setIsLoggedIn  } = useContext(ProductContext);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [showSignInMessage, setShowSignInMessage] = useState(false);

  async function onUserLogin(userCredObj) {
    console.log("in user login meth")
    console.log(userCredObj)
    try {
      const res = await axios.get(
        `http://localhost:4000/users?username=${userCredObj.username}`
      );
      const usersList = res.data;
      
      if (usersList.length === 0) {
        setError('Invalid Username');
      } else {
        const result = compareSync(userCredObj.password, usersList[0].password);
       
        if (result) {
          setIsLoggedIn(true);
          setShowSignInMessage(true);
          alert('Successfully logged in!');
          console.log(isLoggedIn);
          navigate('/cart');
        } else {
          setError('Invalid Password');
        }
      }
    } catch (error) {
      console.error('Error during login:', error);
      setError('An error occurred during login. Please try again.');
    }
  }

  return (
    <Container className="my-5">
   
      <Card>
      {showSignInMessage && (
  <div className="floating-message">
    <p>You have successfully signed in!</p>
  </div>
)}
        <Row className="g-0">
          <Col md="6">
            <Card.Img
              src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/img1.webp"
              alt="login form"
              className="rounded-start w-100"
            />
          </Col>

          <Col md="6">
            <Card.Body className="d-flex flex-column">
              <div className="d-flex flex-row mt-2">
                <FontAwesomeIcon
                  icon={faCubes}
                  className="fa-3x me-3"
                  style={{ color: '#ff6219' }}
                />
                <span className="h1 fw-bold mb-0">Logo</span>
              </div>

              <h5 className="fw-normal my-4 pb-3" style={{ letterSpacing: '1px' }}>
                Sign into your account
              </h5>

              {error.length !== 0 && <p className="text-danger">{error}</p>}

              <Form onSubmit={handleSubmit(onUserLogin)}>
                <Form.Group className="mb-4">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control type="email" {...register('username')} size="lg" />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Password</Form.Label>
                  <Form.Control type="password" {...register('password')} size="lg" />
                </Form.Group>

                <Button className="mb-4 px-5" variant="dark" size="lg" type="submit">
                  Login
                </Button>

                <Link to="/signup" className="small text-muted">
                  New here? Signup
                </Link>
              </Form>

              <a className="small text-muted" href="#!">
                Forgot password?
              </a>
              <p className="mb-5 pb-lg-2" style={{ color: '#393f81' }}>
                Don't have an account? <a href="#!" style={{ color: '#393f81' }}>
                  Register here
                </a>
              </p>

              <div className="d-flex flex-row justify-content-start">
                <a href="#!" className="small text-muted me-1">
                  Terms of use.
                </a>
                <a href="#!" className="small text-muted">
                  Privacy policy
                </a>
              </div>
            </Card.Body>
          </Col>
        </Row>
      </Card>
    </Container>
  );
}

export default App;
