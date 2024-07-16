import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import LoginForm from "./components/Login";
import Register from "./components/Register";
import webSocketService from "./services/WebSocketService";

function App() {
    useEffect(() => {
        webSocketService.connect('ws://140.238.54.136:8080/chat/chat');

        return () => {
            webSocketService.close();
        };
    }, []);

    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" element={<LoginForm />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/login" element={<LoginForm />} />
                    <Route path="/register" element={<Register />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
