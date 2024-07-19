import React from 'react';
import ChatList from './ChatList';
import ChatWindow from './ChatWindow';
import '../styles/Chat.css';

const Chat = () => {
    const handleSelectUser = (user) => {
        // Implement your logic to handle user selection
        console.log('Selected user:', user);
    };

    return (
        <div className="chat-container">
            <ChatList onSelectUser={handleSelectUser} />
            <ChatWindow />
        </div>
    );
};

export default Chat;