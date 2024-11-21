import React, { useState } from 'react';
import { useTokenContext } from '../../context/TokenContext';
import { login } from '../../services/api';
import './Login.css';

export default function Login() {
    const { setToken } = useTokenContext();
    const [username, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({ username: "", password: "", form: "" });

    const validateForm = () => {
        let valid = true;
        let newErrors = {};
        if (!username) {
            newErrors.username = "Username is required";
            valid = false;
        }
        if (!password) {
            newErrors.password = "Password is required";
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }
        try {
            const response = await login(username, password);
            setToken(response.token);
        } catch (error) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                form: error.response?.data?.message || "Invalid username or password. Please try again."
            }));
        }
    };

    return (
        <div className="login-wrapper">
            <h1>Please Log In</h1>
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
            <a href="/register">Register</a>
        </div>
    );
}
