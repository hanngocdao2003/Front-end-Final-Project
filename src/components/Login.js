import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import webSocketService from '../services/WebSocketService';
import '../styles/Login.css';

const LoginForm = () => {
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
      localStorage.setItem('RE_LOGIN_CODE', data.data.RE_LOGIN_CODE);
      localStorage.setItem('username', username);
      navigate('/home');
    } else {
      console.log('Login failed. Please check your username and password.'); // Use console.log instead of alert
    }
  };

  webSocketService.setLoginResponseCallback(handleResponse);

  const navigateToRegister = () => {
    navigate('/register');
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

export default LoginForm;
