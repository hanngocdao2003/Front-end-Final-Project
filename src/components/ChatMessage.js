// ChatMessage.js
import React from 'react';
import '../Chat.css';

const ChatMessage = ({ message, isSent }) => {
    return (
        <div className={`chat-message ${isSent ? 'sent' : 'received'}`}>
            <div className="message-content">{message}</div>
        </div>
    );
};

export default ChatMessage;
