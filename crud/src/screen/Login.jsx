import React, { useState } from "react";
import { Form } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AES from "crypto-js/aes";
import Utf8 from "crypto-js/enc-utf8";
import { showSuccess, showError } from "../utility/toast";
import "../assets/auth.css";
import registerImage from "../assets/react-ragister.jpeg"
const secretKey = "my_super_secret_key";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) return showError("All fields are required");

    const usersEncrypted = JSON.parse(localStorage.getItem("formData") || "[]");

    const users = usersEncrypted.map((u) =>
      JSON.parse(AES.decrypt(u, secretKey).toString(Utf8))
    );

    const user = users.find(
      (u) => u.email === email && u.password === password
    );

    if (!user) return showError("Invalid email or password");

    login(user);
    showSuccess("Login successful");
    navigate("/");
  };

  return (
<div className="container-fluid vh-100 d-flex align-items-center justify-content-center bg-light">
  <div className="card shadow auth-card overflow-hidden">
    <div className="row g-0">

      {/* IMAGE LEFT */}
      <div
        className="col-md-6 auth-image d-none d-md-block order-md-1"
        style={{ backgroundImage: `url(${registerImage})` }}
      >
        <div className="auth-image-text">
          <h2>Organize your tasks</h2>
          <p>Plan • Track • Complete</p>
        </div>
      </div>

      {/* FORM RIGHT */}
      <div className="col-md-6 p-5 d-flex flex-column justify-content-center order-md-2 slide-in">
        <h3 className="text-center mb-4">Welcome Back 👋</h3>

        <Form onSubmit={handleSubmit}>
          <Form.Control
            className="mb-3"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Form.Control
            className="mb-4"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="btn btn-primary w-100 py-2">Sign In</button>
        </Form>

        <p className="text-center mt-4">
          Don’t have an account? <Link to="/register" className="text-primary">Register</Link>
        </p>
      </div>

    </div>
  </div>
</div>




  );
};

export default Login;
