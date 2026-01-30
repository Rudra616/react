import React, { useState } from 'react'
import { Form } from "react-bootstrap";
import { useNavigate } from 'react-router-dom'

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    let users = JSON.parse(localStorage.getItem("formData")) || [];


    if (users.some(u => u.email === form.email)) {
      alert("Email already registered!");
      return;
    }

    users.push(form);
    localStorage.setItem("formData", JSON.stringify(users));

    alert("User registered successfully!");
    navigate("/login")
    setForm({ name: '', email: '', password: '' });
  };


  return (
    <div className="container d-flex justify-content-center mt-5">
      <Form onSubmit={handleSubmit} className="w-100" style={{ maxWidth: 350 }}>
        <h3 className="text-center mb-4">Sign up</h3>
        <div className="mb-3">

          <input type="text" className="form-control"
            name="name" placeholder="Name" value={form.name} onChange={handleChange} />
        </div>
        <div className="mb-3">

          <input type="email" className="form-control"
            name="email" placeholder="Email" value={form.email} onChange={handleChange} />
        </div>
        <div className="mb-3">

          <input type="password" className="form-control"
            name="password" placeholder="Password" value={form.password} onChange={handleChange} />
        </div>
        <button type="submit" className="btn btn-primary w-100">Submit</button>
      </Form>
    </div>

  )
}

export default Register
