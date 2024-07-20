import React, {useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {useWebSocket} from './WebSocketContext';
import '../Auth.css';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const client = useWebSocket();

    const handleLogin = () => {
        if (!username || !password) {
            setMessage('Username and Password are required');
            return;
        }

        if (!client || client.readyState !== WebSocket.OPEN) {
            setMessage('WebSocket connection not established');
            return;
        }

        const messageToSend = {
            action: 'onchat',
            data: {
                event: 'LOGIN',
                data: {
                    user: username,
                    pass: password,
                }
            }
        };

        console.log('Sending message:', messageToSend);
        client.send(JSON.stringify(messageToSend));

        client.onmessage = (event) => {
            console.log('Received message:', event.data);
            const response = JSON.parse(event.data);
            if (response.status === 'success') {
                setMessage('Login successful! Redirecting to chat...');
                setTimeout(() => {
                    navigate('/chat');
                }, 2000); // Redirect after 2 seconds
            } else {
                setMessage('Login failed: ' + response.message);
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
            <h2>Login</h2>
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
            <button onClick={handleLogin}>Login</button>
            {message && <p>{message}</p>}
            <p>Don't have an account? <Link to="/register">Register</Link></p>
        </div>
    );
};

export default Login;
