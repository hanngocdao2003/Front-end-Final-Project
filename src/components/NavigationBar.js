import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/NavigationBar.css';
import NewChatModal from './NewChatModal';
import JoinRoomModal from './JoinRoomModal'; // Import the new modal
import webSocketService from '../services/WebSocketService';

const NavigationBar = () => {
    const navigate = useNavigate();
    const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);
    const [isJoinRoomModalOpen, setIsJoinRoomModalOpen] = useState(false); // State for join room modal

    useEffect(() => {
        webSocketService.setLogoutResponseCallback(handleLogoutResponse);

        return () => {
            webSocketService.setLogoutResponseCallback(null);
        };
    }, []);

    const handleLogoutResponse = (data) => {
        if (data.status === 'success') {
            navigate('/login');
            window.location.reload(); // Clear cache and hard reload
        } else {
            alert('Logout failed. Please try again.');
        }
    };

    const handleLogout = (event) => {
        event.preventDefault();
        webSocketService.logout();
    };

    const openNewChatModal = () => {
        setIsNewChatModalOpen(true);
    };

    const closeNewChatModal = () => {
        setIsNewChatModalOpen(false);
    };

    const openJoinRoomModal = () => {
        setIsJoinRoomModalOpen(true);
    };

    const closeJoinRoomModal = () => {
        setIsJoinRoomModalOpen(false);
    };

    return (
        <div className="navigation-bar">
            <ul className="nav justify-content-center">
                <li className="nav-item">
                    <a className="nav-link active" href="#" onClick={openNewChatModal}>New chat</a>
                </li>
                <li className="nav-item">
                    <a className="nav-link active" href="#" onClick={openJoinRoomModal}>Join room</a>
                </li>
                <li className="nav-item">
                    <a className="nav-link active" onClick={handleLogout} href="#">Log out</a>
                </li>
            </ul>
            <NewChatModal isOpen={isNewChatModalOpen} onRequestClose={closeNewChatModal} />
            <JoinRoomModal isOpen={isJoinRoomModalOpen} onRequestClose={closeJoinRoomModal} /> {/* Add the join room modal */}
        </div>
    );
};

export default NavigationBar;
