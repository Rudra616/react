import React, { useState } from 'react'

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '' })

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
    setForm({ name: '', email: '', password: '' });
  };


  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 300 }}>
      <h3>Simple Form</h3>
      <input type="text" name="name" placeholder="Name" value={form.name} onChange={handleChange} /><br /><br />
      <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} /><br /><br />
      <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} /><br /><br />
      <button type="submit">Submit</button>
    </form>
  )
}

export default Register
