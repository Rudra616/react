import React, { useState } from 'react'
import { useAuth } from "../context/AuthContext";
import { useNavigate } from 'react-router-dom'
import { Form } from "react-bootstrap";

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'email') {
      setEmail(value);
    } else if (name === 'password') {
      setPassword(value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const users = JSON.parse(localStorage.getItem("formData") || "[]");
    const loggedInUser = users.find(u => u.email === email && u.password === password);

    if (loggedInUser) {
      login(loggedInUser);
      navigate("/");
    } else {
      alert("Email or password is incorrect!");
    }
  };
  return (
    <>
      <div className="container d-flex justify-content-center h-2 align-items-center mt-5">
        <Form onSubmit={handleSubmit} className="w-100" style={{ maxWidth: 350 }}>
          <h3 className="text-center mb-4">Sign in</h3>

          <div className="mb-3">
            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="Email"
              value={email}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <input
              type="password"
              name="password"
              className="form-control"
              placeholder="Password"
              value={password}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Submit
          </button>
        </Form>
      </div>
    </>
  );

}

export default Login
