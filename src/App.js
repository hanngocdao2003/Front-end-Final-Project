// src/App.js
import React, { useState } from 'react';
import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Chat from './components/Chat';
import { WebSocketProvider } from './components/WebSocketContext';
import UserList from "./components/UserList";
import ChatBox from "./components/ChatBox";
import './App.css';

function App() {
    const [selectedUser, setSelectedUser] = useState(null);
    const currentUser = { username: 'current_user' };

    return (
        <WebSocketProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<Navigate to="/login" />} />
                    <Route path="/login" element={<Login  />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/chat" element={
                        <div className="chat-container">
                            <UserList onSelectUser={setSelectedUser} />
                            {selectedUser && <ChatBox currentUser={currentUser} selectedUser={selectedUser} />}
                        </div>
                    } />
                </Routes>
            </Router>
        </WebSocketProvider>
    );
}

export default App;
