import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import '../styles/NavigationBar.css';
import NewChatModal from './NewChatModal';
import webSocketService from '../services/WebSocketService';

const NavigationBar = () => {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);

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

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div className="navigation-bar">
            <ul className="nav justify-content-center">
                <li className="nav-item">
                    <a className="nav-link active" href="#" onClick={openModal}>New chat</a>
                </li>
                <li className="nav-item">
                    <a className="nav-link active" onClick={handleLogout} href="#">Log out</a>
                </li>
            </ul>
            <NewChatModal isOpen={isModalOpen} onRequestClose={closeModal} />
        </div>
    );
};

export default NavigationBar;
