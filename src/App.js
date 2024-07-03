import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Chat from './components/Chat';
import { WebSocketProvider } from './components/WebSocketContext';

function App() {
    return (
        <WebSocketProvider>
            <Router>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/chat" element={<Chat />} />
                </Routes>
            </Router>
        </WebSocketProvider>
    );
}

export default App;
