import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useWebSocket } from './WebSocketContext';
import '../Auth.css';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const client = useWebSocket();

    const handleRegister = () => {
        if (!username || !password) {
            setMessage('Username and Password are required');
            return;
        }

        if (!client) {
            setMessage('WebSocket connection not established');
            return;
        }

        const message = {
            action: 'onchat',
            data: {
                event: 'REGISTER',
                data: {
                    user: username,
                    pass: password,
                }
            }
        };

        console.log('Sending message:', message);
        client.send(JSON.stringify(message));

        client.onmessage = (message) => {
            console.log('Received message:', message.data);
            const response = JSON.parse(message.data);
            if (response.status === 'success') {
                setMessage('Registration successful! Redirecting to login...');
                setTimeout(() => {
                    navigate('/login');
                }, 2000); // Redirect after 2 seconds
            } else {
                setMessage('Registration failed: ' + response.mes);
            }
        };

        client.onerror = (error) => {
            console.error('WebSocket error:', error);
            setMessage('WebSocket error');
        };

        client.onclose = () => {
            console.log('WebSocket connection closed');
            setMessage('WebSocket connection closed');
        };
    };

    return (
        <div className="auth-container">
            <h2>Register</h2>
            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleRegister}>Register</button>
            {message && <p>{message}</p>}
            <p>Already have an account? <Link to="/login">Login</Link></p>
        </div>
    );
};

export default Register;
