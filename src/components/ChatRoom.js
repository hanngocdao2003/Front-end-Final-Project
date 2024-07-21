import React from 'react';
import '../styles/ChatRoom.css'; // Make sure you have appropriate styles

const ChatRoom = ({ name, onClick }) => {
    return (
        <div className="chat-room" onClick={onClick}>
            <h3>{name}</h3>
        </div>
    );
};

export default ChatRoom;
