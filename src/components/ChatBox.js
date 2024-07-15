// ChatBox.js
import React, { useState, useEffect } from 'react';
import { useWebSocket } from './WebSocketContext';
import ChatMessage from './ChatMessage';
import '../Chat.css';

const ChatBox = ({ currentUser, selectedUser }) => {
    const { client } = useWebSocket();
    const [chatMessages, setChatMessages] = useState([]);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchChatHistory = () => {
            if (client && selectedUser) {
                client.send(JSON.stringify({
                    action: 'onchat',
                    data: {
                        event: 'GET_PEOPLE_CHAT_MES',
                        data: {
                            name: selectedUser.username,
                            page: 1
                        }
                    }
                }));
            }
        };

        fetchChatHistory();

        return () => {
            if (client) {
                client.onmessage = null;
            }
        };
    }, [client, selectedUser]);

    useEffect(() => {
        if (client) {
            client.onmessage = (message) => {
                const dataFromServer = JSON.parse(message.data);
                if (dataFromServer.data) {
                    if (dataFromServer.data.event === 'GET_PEOPLE_CHAT_MES' && dataFromServer.data.status === 'success') {
                        setChatMessages(dataFromServer.data.messages);
                    } else if (dataFromServer.data.event === 'SEND_CHAT' && dataFromServer.data.status === 'success') {
                        setChatMessages(prevMessages => [...prevMessages, dataFromServer.data.message]);
                    }
                }
            };
        }
    }, [client]);

    const handleSendMessage = () => {
        if (client && message.trim() !== '') {
            client.send(JSON.stringify({
                action: 'onchat',
                data: {
                    event: 'SEND_CHAT',
                    data: {
                        type: 'people',
                        to: selectedUser.username,
                        mes: message
                    }
                }
            }));
            setMessage('');
        }
    };

    return (
        <div className="chat-box">
            <div className="chat-messages">
                {chatMessages.map((msg, index) => (
                    <ChatMessage
                        key={index}
                        message={msg.mes}
                        isSent={msg.sender === currentUser.username}
                    />
                ))}
            </div>
            <div className="message-input">
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message..."
                />
                <button onClick={handleSendMessage}>Send</button>
            </div>
        </div>
    );
};

export default ChatBox;
