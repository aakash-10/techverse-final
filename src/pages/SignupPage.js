// signup.js
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { hashSync } from 'bcryptjs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCubes } from '@fortawesome/free-solid-svg-icons';
import { Card, Row, Col, Form, Button } from 'react-bootstrap';
// Import the stylesheet if needed

const SignupPage = () => {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();

  const [error, setError] = useState('');

  async function onUserRegister(userObj) {
    try {
      // Search for duplicate user
      const res1 = await axios.get(`http://localhost:4000/users?username=${userObj.username}`);
      const usersList = res1.data;

      if (usersList.length === 0) {
        if (userObj.username.length < 5) {
          setError('Username must contain at least 5 characters.');
        } else if (userObj.password.length < 8) {
          setError('Password must contain at least 8 characters.');
        } else {
          const hashedPassword = hashSync(userObj.password, 5);
          userObj.password = hashedPassword;
          const res = await axios.post('http://localhost:4000/users', userObj);
          if (res.status === 201) {
            navigate('/login');
          }
        }
      } else {
        setError('User already exists!');
      }
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="my-5">
      <Card>
        <Row className="g-0">
          <Col md="6">
            <Card.Body className="d-flex flex-column">
              <div className="d-flex flex-row mt-2">
                <FontAwesomeIcon icon={faCubes} className="fa-3x me-3" style={{ color: '#ff6219' }} />
                <span className="h1 fw-bold mb-0">Logo</span>
              </div>

              <h5 className="fw-normal my-4 pb-3" style={{ letterSpacing: '1px' }}>
                Sign Up for an account
              </h5>

              {error.length !== 0 && <p className="text-danger">{error}</p>}

              <Form onSubmit={handleSubmit(onUserRegister)}>
                <Form.Group className="mb-4">
                  <Form.Label>Username</Form.Label>
                  <Form.Control type="text" {...register('username')} placeholder="Enter your Username" required />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Password</Form.Label>
                  <Form.Control type="password" {...register('password')} placeholder="Enter your password" required />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Email</Form.Label>
                  <Form.Control type="email" {...register('email')} placeholder="Enter your email" required />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Date of Birth</Form.Label>
                  <Form.Control type="date" {...register('dob')} placeholder="Date of Birth" required />
                </Form.Group>

                <Button className="mb-4 px-5" variant="dark" size="lg" type="submit">
                  Sign Up
                </Button>

                <Link to="/login" className="small text-muted">
                  Already have an account? Login
                </Link>
              </Form>
            </Card.Body>
          </Col>

          <Col md="6">
            <Card.Img
              src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/img1.webp"
              alt="signup form"
              className="rounded-start w-100"
            />
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default SignupPage;
