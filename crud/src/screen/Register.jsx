import React, { useState } from "react";
import { Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AES from "crypto-js/aes";
import Utf8 from "crypto-js/enc-utf8";
import { showSuccess, showError, showWarning } from "../utility/toast";

const secretKey = "my_super_secret_key"; // same as AuthContext

const Register = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "name" && value.length > 10) return;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const isValidPassword = (password) =>
    /^[A-Z][a-z0-9]{6,32}[@#_]$/.test(password);
  const isValidUsername = (name) => /^[A-Za-z0-9]{8,10}$/.test(name);

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, email, password } = form;

    if (!name || !email || !password) {
      showError("All fields are required");
      return;
    }
    if (!isValidUsername(name)) {
      showWarning("Username must be 8-10 letters or numbers");
      return;
    }
    if (!isValidPassword(password)) {
      showWarning(
        "Password must start with a capital letter, contain 6-32 lowercase letters/numbers, and end with @, #, or _"
      );
      return;
    }

    let usersEncrypted = JSON.parse(localStorage.getItem("formData") || "[]");

    // decrypt users to check email
    const decryptedUsers = usersEncrypted.map((u) =>
      JSON.parse(AES.decrypt(u, secretKey).toString(Utf8))
    );
    if (decryptedUsers.some((u) => u.email === email)) {
      showError("Email already registered!");
      return;
    }

    // encrypt new user
    const encryptedUser = AES.encrypt(JSON.stringify(form), secretKey).toString();
    usersEncrypted.push(encryptedUser);
    localStorage.setItem("formData", JSON.stringify(usersEncrypted));

    login(form); // log in decrypted user
    showSuccess("User registered and logged in!");
    setForm({ name: "", email: "", password: "" });
    navigate("/");
  };

  return (
    <div className="container d-flex justify-content-center mt-5">
      <Form onSubmit={handleSubmit} className="w-100" style={{ maxWidth: 350 }}>
        <h3 className="text-center mb-4">Sign up</h3>

        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            maxLength={10}
          />
        </div>

        <div className="mb-3">
          <input
            type="email"
            className="form-control"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <input
            type="password"
            className="form-control"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="btn btn-primary w-100">
          Submit
        </button>
      </Form>
    </div>
  );
};

export default Register;
