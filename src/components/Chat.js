import React, { useState, useEffect } from 'react';
import ChatMessage from './ChatMessage';
import webSocketService from '../services/WebSocketService';

const Chat = ({ selectedUser, currentUser }) => {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const handleMessageReceived = (data) => {
            if (data.event === 'RECEIVE_CHAT' && data.status === 'success') {
                setMessages((prevMessages) => [...prevMessages, data.data]);
            }
        };

        webSocketService.setMessageReceivedCallback(handleMessageReceived);

        return () => {
            webSocketService.setMessageReceivedCallback(null);
        };
    }, []);

    const handleSendMessage = () => {
        const msg = { type: 'people', to: selectedUser.name, mes: message, from: currentUser };
        webSocketService.sendMessage('people', selectedUser.name, message);
        setMessages((prevMessages) => [...prevMessages, msg]);
        setMessage('');
    };

    return (
        <div className="chat-window">
            <h2>Chat with {selectedUser.name}</h2>
            <div className="chat-messages">
                {messages.map((msg, index) => (
                    <ChatMessage key={index} message={msg.mes} isSent={msg.from === currentUser} />
                ))}
            </div>
            <div className="chat-input">
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message"
                />
                <button onClick={handleSendMessage}>Send</button>
            </div>
        </div>
    );
};

export default Chat;
