import React, { useState } from 'react';
import '../styles/NewChatModal.css';
import webSocketService from '../services/WebSocketService';

const NewChatModal = ({ isOpen, onRequestClose }) => {
    const [chatType, setChatType] = useState('people');
    const [username, setUsername] = useState('');
    const [message, setMessage] = useState('');

    const handleSend = () => {
        const messageData = {
            action: 'onchat',
            data: {
                event: 'SEND_CHAT',
                data: {
                    type: chatType,
                    to: username,
                    mes: message,
                },
            },
        };

        webSocketService.send(messageData);
        onRequestClose(); // Close the modal after sending the message
    };

    if (!isOpen) {
        return null;
    }

    return (
        <div className="modal-overlay">
            <div className="new-chat-modal">
                <div className="modal-header">
                    <h2>New Chat</h2>
                </div>
                <div className="form-group">
                    <label htmlFor="chatType">Type</label>
                    <select
                        id="chatType"
                        value={chatType}
                        onChange={(e) => setChatType(e.target.value)}
                    >
                        <option value="people">People</option>
                        <option value="room">Room</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="username">Name</label>
                    <input
                        id="username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="message">Message</label>
                    <textarea
                        id="message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    ></textarea>
                </div>
                <div className="modal-footer">
                    <button onClick={onRequestClose}>Close</button>
                    <button onClick={handleSend}>Send</button>
                </div>
            </div>
        </div>
    );
};

export default NewChatModal;
