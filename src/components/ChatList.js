import React, { useState, useEffect } from 'react';
import ChatPerson from './ChatPerson';
import webSocketService from '../services/WebSocketService';

const ChatList = ({ onSelectUser }) => {
    const [people, setUsers] = useState([]);

    useEffect(() => {
        const handleUserListResponse = (data) => {
            console.log('handleUserListResponse called with data:', data);
            if (data.event === 'GET_USER_LIST' && data.status === 'success') {
                console.log('User list received:', data.data);
                // Sort users by actionTime in descending order before setting state
                const sortedUsers = data.data.sort((user1, user2) => user2.actionTime - user1.actionTime);
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

    return (
        <div className="chat-list">
            {people.map((user) => (
                <ChatPerson key={user.name} name={user.name} onClick={() => onSelectUser(user)} />
            ))}
        </div>
    );
};

export default ChatList;