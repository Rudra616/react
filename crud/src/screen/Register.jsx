import React, { useState } from "react";
import { Form } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AES from "crypto-js/aes";
import Utf8 from "crypto-js/enc-utf8";
import { showSuccess, showError, showWarning } from "../utility/toast";
import "../assets/auth.css";
import loginImage from "../assets/react-login.jpeg";

const secretKey = "my_super_secret_key";

const Register = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const { login } = useAuth();
  const navigate = useNavigate();

  const isValidPassword = (p) =>
    /^[A-Z][a-z0-9]{6,32}[@#_]$/.test(p);
  const isValidUsername = (n) =>
    /^[A-Za-z0-9]{8,10}$/.test(n);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.password)
      return showError("All fields required");

    if (!isValidUsername(form.name))
      return showWarning("Username must be 8-10 characters");

    if (!isValidPassword(form.password))
      return showWarning("Password format invalid");

    let usersEncrypted = JSON.parse(localStorage.getItem("formData") || "[]");

    const users = usersEncrypted.map((u) =>
      JSON.parse(AES.decrypt(u, secretKey).toString(Utf8))
    );

    if (users.some((u) => u.email === form.email))
      return showError("Email already exists");

    const encryptedUser = AES.encrypt(
      JSON.stringify(form),
      secretKey
    ).toString();

    usersEncrypted.push(encryptedUser);
    localStorage.setItem("formData", JSON.stringify(usersEncrypted));

    login(form);
    showSuccess("Registration successful");
    navigate("/");
  };

  return (
<div className="container-fluid vh-100 d-flex align-items-center justify-content-center bg-light">
  <div className="card shadow auth-card overflow-hidden">
    <div className="row g-0">

      {/* FORM LEFT */}
      <div className="col-md-6 p-5 d-flex flex-column justify-content-center slide-in order-md-1">
        <h3 className="text-center mb-4">Create Account</h3>

        <Form onSubmit={handleSubmit}>
          <Form.Control
            className="mb-3"
            placeholder="Username"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <Form.Control
            className="mb-3"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <Form.Control
            className="mb-3"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <button className="btn btn-primary w-100 py-2">Register</button>
        </Form>

        <p className="text-center mt-3">
          Already have an account? <Link className="text-primary" to="/login">Sign in</Link>
        </p>
      </div>

      {/* IMAGE RIGHT */}
      <div
        className="col-md-6 auth-image d-none d-md-block order-md-2"
        style={{ backgroundImage: `url(${loginImage})` }}
      >
        <div className="auth-image-text">
          <h2>Start managing today</h2>
          <p>Your productivity companion</p>
        </div>
      </div>

    </div>
  </div>
</div>

  );
};

export default Register;
