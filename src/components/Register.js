import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import webSocketService from '../services/WebSocketService'; // Ensure this path is correct
import '../styles/Login.css';

const Register = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleRegister = (event) => {
        event.preventDefault();

        // Validate passwords
        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        const registrationData = {
            action: 'onchat',
            data: {
                event: 'REGISTER',
                data: {
                    user: username,
                    pass: password,
                },
            },
        };

        webSocketService.send(registrationData);
    };

    const handleResponse = (data) => {
        if (data.event === 'REGISTER' && data.status === 'success') {
            navigate('/login'); // Navigate to login page upon successful registration
        } else {
            alert('Registration failed. Please try again.');
        }
    };

    // Ensure the callback is set after WebSocketService is imported
    React.useEffect(() => {
        webSocketService.setRegistrationResponseCallback(handleResponse);

        return () => {
            webSocketService.setRegistrationResponseCallback(null); // Clean up callback
        };
    }, []);

    const navigateLogin = (event) => {
        navigate('/login');
    };

    return (
        <div className="container">
            <div className="login-form">
                <form onSubmit={handleRegister}>
                    <div className="input-container">
                        <label htmlFor="username" className="floating-label">Username</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder=" "
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
                            placeholder=" "
                        />
                    </div>
                    <div className="input-container">
                        <label htmlFor="confirmPassword" className="floating-label">Confirm Password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder=" "
                        />
                    </div>
                    <div className="back-login-form-button">
                        <div className="button-container">
                            <button id="backLoginBtn" type="button" onClick={navigateLogin}>Go back to Login</button>
                            <button id="registerAccountBtn" type="submit">Register Account</button>
                        </div>
                        {/*<div className="reset-password">*/}
                        {/*    <a href="#">Reset Password</a>*/}
                        {/*</div>*/}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;
