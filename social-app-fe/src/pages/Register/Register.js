import React, { useState } from 'react';
import axios from 'axios'
import '../../pages/Login/Login.css';
import { useTokenContext } from '../../context/TokenContext';
import { useNavigate } from 'react-router-dom';

export default function Register() {
    const { setToken } = useTokenContext();
    const [username, setUserName] = useState();
    const [password, setPassword] = useState();

    const navigate = useNavigate();

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            const res = await axios.post("http://localhost:6080/api/auth/register", { username, password });
            setToken(res.data.token);
            navigate('/login'); // Navigate to login page

        } catch (error) {
            alert("Register failed");
        }
    }
    return (
        <div className="login-wrapper">
            <h1>Sign Up</h1>
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
        </div>
    )
}
