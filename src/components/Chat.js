import React, {useState, useEffect} from 'react';
import {useWebSocket} from './WebSocketContext';
import '../Chat.css';

const Chat = ({recipient}) => {
    const client = useWebSocket();
    const [message, setMessage] = useState('');
    const [chatHistory, setChatHistory] = useState([]);

    useEffect(() => {
        const handleMessage = (message) => {
            try {
                const dataFromServer = JSON.parse(message.data);
                if (dataFromServer.event === 'SEND_CHAT') {
                    if (dataFromServer.status === 'success') {
                        setChatHistory(prevHistory => [...prevHistory, dataFromServer.data]);
                    } else {
                        console.error('Failed to send message:', dataFromServer.message);
                    }
                }
            } catch (e) {
                console.error('Failed to parse message:', e);
            }
        };

        if (client) {
            client.onmessage = handleMessage;
        }

        return () => {
            if (client) {
                client.onmessage = null;
            }
        };
    }, [client]);

    const handleSendMessage = () => {
        if (client) {
            const messageToSend = {
                action: 'onchat',
                data: {
                    event: 'SEND_CHAT',
                    data: {
                        type: 'people',
                        to: recipient,
                        mes: message
                    }
                }
            };

            client.send(JSON.stringify(messageToSend));
            setMessage('');
        } else {
            console.error('WebSocket connection not established');
        }
    };

    return (
        <div className="chat">
            <h2>Chat with {recipient}</h2>
            <div className="chat-history">
                {chatHistory.map((msg, index) => (
                    <p key={index}><strong>{msg.sender}:</strong> {msg.mes}</p>
                ))}
            </div>
            <input
                type="text"
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
            />
            <button onClick={handleSendMessage}>Send</button>
        </div>
    );
};

export default Chat;
