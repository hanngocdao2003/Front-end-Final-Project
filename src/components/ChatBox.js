import React, {useState, useEffect, useRef} from 'react';
import {useWebSocket} from './WebSocketContext';
import ChatMessage from './ChatMessage';
import '../Chat.css';

const ChatBox = ({currentUser, selectedUser}) => {
    const client = useWebSocket();
    const [chatMessages, setChatMessages] = useState([]);
    const [message, setMessage] = useState('');
    const chatEndRef = useRef(null);

    const LOCAL_STORAGE_KEY = `chatMessages_${selectedUser ? selectedUser.name : ''}`;

    useEffect(() => {
        if (selectedUser) {
            const savedMessages = localStorage.getItem(LOCAL_STORAGE_KEY);
            if (savedMessages) {
                setChatMessages(JSON.parse(savedMessages));
            } else if (client) {
                client.send(JSON.stringify({
                    action: 'onchat',
                    data: {
                        event: 'GET_PEOPLE_CHAT_MES',
                        data: {
                            name: selectedUser.name,
                            page: 1
                        }
                    }
                }));
            }
        } else {
            setChatMessages([]);
        }

        return () => {
            if (client) {
                client.onmessage = null;
            }
        };
    }, [client, selectedUser, LOCAL_STORAGE_KEY]);

    useEffect(() => {
        if (client) {
            const handleMessage = (message) => {
                try {
                    const dataFromServer = JSON.parse(message.data);
                    if (dataFromServer.event) {
                        if (dataFromServer.event === 'GET_PEOPLE_CHAT_MES' && dataFromServer.status === 'success') {
                            const messages = dataFromServer.data || [];
                            setChatMessages(messages);
                            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(messages));
                        } else if (dataFromServer.event === 'SEND_CHAT' && dataFromServer.status === 'success') {
                            const newMessage = {
                                ...dataFromServer.data,
                                timestamp: dataFromServer.data.timestamp || new Date().toISOString() // Default to current time if missing
                            };
                            setChatMessages(prevMessages => {
                                const updatedMessages = [...prevMessages, newMessage];
                                localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedMessages));
                                return updatedMessages;
                            });
                        }
                    }
                } catch (e) {
                    console.error('Failed to parse message:', e);
                }
            };

            client.onmessage = handleMessage;

            return () => {
                client.onmessage = null;
            };
        }
    }, [client, LOCAL_STORAGE_KEY]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({behavior: "smooth"});
    }, [chatMessages]);

    const handleSendMessage = () => {
        if (client && message.trim() !== '') {
            const newMessage = {
                sender: currentUser.username,
                mes: message,
                timestamp: new Date().toISOString(),
            };
            setChatMessages(prevMessages => {
                const updatedMessages = [...prevMessages, newMessage];
                localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedMessages));
                return updatedMessages;
            });

            client.send(JSON.stringify({
                action: 'onchat',
                data: {
                    event: 'SEND_CHAT',
                    data: {
                        type: 'people',
                        to: selectedUser.name,
                        mes: message,
                        timestamp: newMessage.timestamp
                    }
                }
            }));
            setMessage('');
        }
    };

    return (
        <div className="chat-box">
            <div className="chat-messages">
                {chatMessages.length > 0 ? (
                    chatMessages.map((msg, index) => (
                        <ChatMessage
                            key={index}
                            message={msg.mes}
                            isSent={msg.sender === currentUser.username}
                            timestamp={msg.timestamp}
                        />
                    ))
                ) : (
                    <p>No messages yet.</p>
                )}
                <div ref={chatEndRef}/>
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
