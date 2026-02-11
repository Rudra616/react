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
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const { login } = useAuth();
  const navigate = useNavigate();

  const isValidUsername = (name) =>
    /^[A-Za-z0-9]{8,10}$/.test(name);

  const isValidPassword = (password) =>
    /^[A-Z][a-z0-9]{6,32}[@#_]$/.test(password);

  const handleSubmit = (e) => {
    e.preventDefault();

    const { name, email, password, confirmPassword } = form;

    if (!name || !email || !password || !confirmPassword) {
      return showError("All fields are required");
    }

    if (!isValidUsername(name)) {
      return showWarning(
        "Username must be 8–10 characters long and contain only letters and numbers"
      );
    }
    let usersEncrypted = JSON.parse(localStorage.getItem("formData") || "[]");

    const users = usersEncrypted.map((u) =>
      JSON.parse(AES.decrypt(u, secretKey).toString(Utf8))
    );

    if (users.some((u) => u.email === email)) {
      return showError("Email already exists");
    }
    if (!isValidPassword(password)) {
      return showWarning(
        "Password must start with a capital letter, end with @ # or _, and be 8–34 characters long Ex: Test@123"
      );
    }

    if (password !== confirmPassword) {
      return showError("Password and Confirm Password do not match");
    }



    const encryptedUser = AES.encrypt(
      JSON.stringify({ name, email, password }),
      secretKey
    ).toString();

    usersEncrypted.push(encryptedUser);
    localStorage.setItem("formData", JSON.stringify(usersEncrypted));

    login({ name, email });
    showSuccess("Registration successful 🎉");
    navigate("/");
  };

  return (
    <div className="container-fluid vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="card shadow auth-card overflow-hidden">
        <div className="row g-0">

          {/* FORM */}
          <div className="col-md-6 p-5 d-flex flex-column justify-content-center slide-in">
            <h3 className="text-center mb-4">Create Account</h3>

            <Form onSubmit={handleSubmit}>
              <Form.Control
                className="mb-3"
                placeholder="Username"
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
              />

              <Form.Control
                className="mb-3"
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
              />

              <Form.Control
                className="mb-3"
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
              />

              <Form.Control
                className="mb-3"
                type="password"
                placeholder="Confirm Password"
                value={form.confirmPassword}
                onChange={(e) =>
                  setForm({ ...form, confirmPassword: e.target.value })
                }
              />

              <button className="btn btn-primary w-100 py-2">
                Register
              </button>
            </Form>

            <p className="text-center mt-3">
              Already have an account?{" "}
              <Link className="text-primary" to="/login">
                Sign in
              </Link>
            </p>
          </div>

          {/* IMAGE */}
          <div
            className="col-md-6 auth-image d-none d-md-block"
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
