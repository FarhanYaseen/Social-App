import React, { useState } from 'react';
import axios from 'axios'
import './Login.css';
import { useTokenContext } from '../../context/TokenContext';


async function loginUser(credentials) {
    return fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
    })
        .then(data => data.json())
}

export default function Login() {

    const { setToken } = useTokenContext();
    const [username, setUserName] = useState();
    const [password, setPassword] = useState();

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            const res = await axios.post("http://localhost:6080/api/auth/login", { username, password });
            setToken(res.data.token);
        } catch (error) {
            alert("Login failed");
        }
    }
    return (
        <div className="login-wrapper">
            <h1>Please Log In</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    <p>Username</p>
                    <input type="text" onChange={(e) => setUserName(e.target.value)} />
                </label>
                <label>
                    <p>Password</p>
                    <input type="password" onChange={(e) => setPassword(e.target.value)} />
                </label>
                <div>
                    <button type="submit">Submit</button>
                </div>
            </form>
            <a href="/register">Register</a>
        </div>
    )
}
