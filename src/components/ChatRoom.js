import React from 'react';
import '../styles/ChatRoom.css'; // Make sure you have appropriate styles

const ChatRoom = ({ name, onClick, latestMessage }) => {
    return (
        <div className="chat-room" onClick={onClick}>
          <div className="chat-room-name">{name}</div>
          {latestMessage && (
            <div className="chat-room-latest-message">{latestMessage.text}</div>
          )}
        </div>
      );
};

export default ChatRoom;
