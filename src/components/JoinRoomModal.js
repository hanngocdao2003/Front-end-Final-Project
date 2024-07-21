import React, { useState } from 'react';
import '../styles/NewChatModal.css'; // Ensure this has the necessary styles
import webSocketService from '../services/WebSocketService';

const JoinRoomModal = ({ isOpen, onRequestClose }) => {
    const [roomName, setRoomName] = useState('');

    const handleSend = () => {
        if (!roomName.trim()) {
            alert('Room name cannot be empty.');
            return;
        }

        const joinRoomData = {
            action: 'onchat',
            data: {
                event: 'JOIN_ROOM',
                data: {
                    name: roomName.trim() // Ensure roomName is trimmed
                }
            }
        };

        webSocketService.send(joinRoomData);
        onRequestClose(); // Close the modal after sending the message
    };

    if (!isOpen) {
        return null;
    }

    return (
        <div className="modal-overlay">
            <div className="new-chat-modal">
                <div className="modal-header">
                    <h2>Join a new chat room</h2>
                </div>
                <div className="form-group">
                    <label htmlFor="roomname">Room name</label>
                    <input
                        id="roomname"
                        type="text"
                        value={roomName}
                        onChange={(e) => setRoomName(e.target.value)}
                        placeholder="Enter room name"
                    />
                </div>
                <div className="modal-footer">
                    <button onClick={onRequestClose}>Close</button>
                    <button onClick={handleSend}>Join</button>
                </div>
            </div>
        </div>
    );
};

export default JoinRoomModal;
