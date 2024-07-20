import React, {useState} from 'react';
import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Chat from './components/Chat';
import CreateRoomModal from './components/CreateRoomModal'; // Import modal component
import {WebSocketProvider} from './components/WebSocketContext';
import './Chat.css';
import './App.css';
import UserList from "./components/UserList";
import ChatBox from "./components/ChatBox";

function App() {
    const [selectedUser, setSelectedUser] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState({username: 'current_user'}); // Example username

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    return (
        <WebSocketProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<Navigate to="/login"/>}/>
                    <Route path="/login" element={<Login/>}/>
                    <Route path="/register" element={<Register/>}/>
                    <Route path="/chat" element={
                        <div className="chat-container">
                            <button onClick={openModal}>Create Room</button>
                            <UserList onSelectUser={setSelectedUser}/>
                            {selectedUser && <ChatBox currentUser={currentUser} selectedUser={selectedUser}/>}
                            {isModalOpen &&
                                <CreateRoomModal onClose={closeModal} currentUser={currentUser}/>} {/* Render modal */}
                        </div>
                    }/>
                </Routes>
            </Router>
        </WebSocketProvider>
    );
}

export default App;
