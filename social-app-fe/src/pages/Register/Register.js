import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../../services/api';
import { useTokenContext } from '../../context/TokenContext';
import '../../pages/Login/Login.css';

export default function Register() {
    const { setToken } = useTokenContext();
    const [username, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errors, setErrors] = useState({ username: "", password: "", email: "", confirmPassword: "", form: "" });

    const navigate = useNavigate();

    const validateForm = () => {
        let valid = true;
        let errors = {};
        if (!username || username.length < 3 || /\s/.test(username)) {
            errors.username = "Username must be at least 3 characters long and cannot contain spaces";
            valid = false;
        }
        if (!email || !/^[\w-.]+@[\w-]+\.[a-z]{2,}$/i.test(email)) {
            errors.email = "Invalid email address";
            valid = false;
        }
        if (!password || password.length < 6) {
            errors.password = "Password must be at least 6 characters long";
            valid = false;
        }
        if (password !== confirmPassword) {
            errors.confirmPassword = "Passwords do not match";
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
            const response = await register(username, password, email);
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
                    <p>Email</p>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    {errors.email && <p className="error-message">{errors.email}</p>}
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
                <label>
                    <p>Confirm Password</p>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    {errors.confirmPassword && <p className="error-message">{errors.confirmPassword}</p>}
                </label>
                <div>
                    <button type="submit">Submit</button>
                </div>
            </form>
            <a href="/login">Login</a>
        </div>
    );
}