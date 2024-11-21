import React, { useState } from 'react';
import { useTokenContext } from '../../context/TokenContext';
import { login } from '../../services/api'
import './Login.css';


export default function Login() {

    const { setToken } = useTokenContext();
    const [username, setUserName] = useState();
    const [password, setPassword] = useState();

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            const response = await login(username, password)
            setToken(response.token);
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
