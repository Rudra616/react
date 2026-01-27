import React, { useState } from 'react'
import { useAuth } from "../context/AuthContext";
import { useNavigate } from 'react-router-dom'

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
            <form onSubmit={handleSubmit} style={{ maxWidth: 300 }}>
                <h3>Simple Form</h3>


                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={email}
                    onChange={handleChange}
                />
                <br /><br />

                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={password}
                    onChange={handleChange}
                />
                <br /><br />

                <button type="submit">Submit</button>
            </form>
        </>
    )
}

export default Login
