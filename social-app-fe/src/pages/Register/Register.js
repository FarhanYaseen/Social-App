import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../../services/api';
import { useTokenContext } from '../../context/TokenContext';
import '../../pages/Login/Login.css';

export default function Register() {
    const { setToken } = useTokenContext();
    const [username, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({ username: "", password: "", form: "" });

    const navigate = useNavigate();

    const validateForm = () => {
        let valid = true;
        let errors = {};
        if (!username || username.length < 3) {
            errors.username = "Username must be at least 3 characters long";
            valid = false;
        }
        if (!password || password.length < 6) {
            errors.password = "Password must be at least 6 characters long";
            valid = false;
        }
        setErrors(errors);
        return valid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }
        try {
            const response = await register(username, password);
            setToken(response.token);
            navigate('/dashboard');
        } catch (error) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                form: error.response?.data?.message || "Something went wrong. Please try again."
            }));
        }
    };

    return (
        <div className="login-wrapper">
            <h1>Sign Up</h1>
            {errors.form && <p className="error-message form-error">{errors.form}</p>}
            <form onSubmit={handleSubmit}>
                <label>
                    <p>Username</p>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUserName(e.target.value)}
                    />
                    {errors.username && <p className="error-message">{errors.username}</p>}
                </label>
                <label>
                    <p>Password</p>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {errors.password && <p className="error-message">{errors.password}</p>}
                </label>
                <div>
                    <button type="submit">Submit</button>
                </div>
            </form>
            <a href="/login">Login</a>
        </div>
    );
}
