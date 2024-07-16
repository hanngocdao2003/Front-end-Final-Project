import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import webSocketService from '../services/WebSocketService';
import '../styles/Login.css';

const Login = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (event) => {
        event.preventDefault();

        const loginData = {
            action: 'onchat',
            data: {
                event: 'LOGIN',
                data: {
                    user: username,
                    pass: password,
                },
            },
        };

        webSocketService.send(loginData);
    };

    const handleResponse = (data) => {
        if (data.status === 'success') {
            navigate('/home'); // Navigate to home page upon successful login
        } else {
            alert('Login failed. Please check your username and password.');
        }
    };

    // Register handleResponse as callback for login response
    webSocketService.setLoginResponseCallback(handleResponse);

    const navigateToRegister = () => {
        navigate('/register'); // Navigate to register page
    };

    return (
        <div className="container">
            <div className="login-form">
                <form onSubmit={handleLogin}>
                    <div className="input-container">
                        <label htmlFor="username" className="floating-label">Username</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div className="input-container">
                        <label htmlFor="password" className="floating-label">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div className="login-form-button">
                        <button type="submit" id="loginBtn">Login</button>
                        <button type="button" id="registerBtn" onClick={navigateToRegister}>Register</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;