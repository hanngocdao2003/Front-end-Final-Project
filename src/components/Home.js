import React, { useState, useEffect } from 'react';
import Container from './Container';
import NavigationBar from './NavigationBar';
import Chat from './Chat';
import ChatList from './ChatList';
// import '../styles/Home.css';
import webSocketService from '../services/WebSocketService';

const Home = () => {
    const [selectedUser, setSelectedUser] = useState(null);
    const [users, setUsers] = useState([]);
    const currentUser = 'long'; // Assume the current user

    useEffect(() => {
        const handleUserListResponse = (data) => {
            console.log('handleUserListResponse called with data:', data);
            if (data.event === 'GET_USER_LIST' && data.status === 'success') {
                console.log('User list received:', data.data);
                // Sort users by actionTime in descending order before setting state
                const sortedUsers = data.data.sort((user1, user2) => new Date(user2.actionTime) - new Date(user1.actionTime));
                setUsers(sortedUsers);
            } else {
                console.error('Unexpected data structure:', data);
            }
        };

        // Connect to WebSocket if not already connected
        if (!webSocketService.socket || webSocketService.socket.readyState !== WebSocket.OPEN) {
            webSocketService.connect('ws://140.238.54.136:8080/chat/chat');
        }

        // Set the callback for user list response
        webSocketService.setUserListResponseCallback(handleUserListResponse);

        // Send request to get user list
        webSocketService.getUserList();

        // Cleanup callback on unmount
        return () => {
            console.log('Cleaning up user list response callback');
            webSocketService.setUserListResponseCallback(null);
        };
    }, []);

    const handleSelectUser = (user) => {
        setSelectedUser(user);
    };

    return (
        <Container>
            <NavigationBar />
            <div className="home">
                <div className="chat-list-container">
                    <ChatList users={users} onSelectUser={handleSelectUser} />
                </div>
                <div className="chat-window-container">
                    {selectedUser ? (
                        <Chat selectedUser={selectedUser} currentUser={currentUser} />
                    ) : (
                        <div className="chat-placeholder">Please select a user to chat with</div>
                    )}
                </div>
            </div>
        </Container>
    );
};

export default Home;
