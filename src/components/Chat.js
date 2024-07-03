import React, { useState, useEffect } from 'react';
import { useWebSocket } from './WebSocketContext';

const Chat = () => {
    const [messageInput, setMessageInput] = useState('');
    const [messages, setMessages] = useState([]);
    const [messageStatus, setMessageStatus] = useState('');
    const client = useWebSocket();

    useEffect(() => {
        if (!client) return;

        // Example of joining a chat room upon component mount
        const joinRoomMessage = {
            action: 'onchat',
            data: {
                event: 'JOIN_ROOM',
                data: {
                    name: 'ABC' // Replace with actual room name
                }
            }
        };

        client.send(JSON.stringify(joinRoomMessage));

        // Example of subscribing to incoming chat messages
        client.onmessage = (event) => {
            const message = JSON.parse(event.data);
            handleIncomingMessage(message);
        };

        return () => {
            // Clean up WebSocket listener on component unmount
            client.onmessage = null;
        };
    }, [client]);

    const handleIncomingMessage = (message) => {
        switch (message.event) {
            case 'GET_ROOM_CHAT_MES':
                setMessages(message.data.messages);
                break;
            // Handle other message types as needed
            default:
                console.log('Received unknown message type: ', message);
        }
    };

    const sendMessage = () => {
        if (!client || !messageInput) return;

        const sendChatMessage = {
            action: 'onchat',
            data: {
                event: 'SEND_CHAT',
                data: {
                    type: 'room',
                    to: 'ABC', // Replace with actual room name
                    mes: messageInput
                }
            }
        };

        client.send(JSON.stringify(sendChatMessage));
        setMessageInput('');
    };

    return (
        <div className="chat-container">
            <div className="message-container">
                {messages.map((msg, index) => (
                    <div key={index} className="message">
                        <p>{msg.sender}: {msg.text}</p>
                    </div>
                ))}
            </div>
            <div className="input-container">
                <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    placeholder="Type your message..."
                />
                <button onClick={sendMessage}>Send</button>
            </div>
            {messageStatus && <p>{messageStatus}</p>}
        </div>
    );
};

export default Chat;
