import React, { useState } from 'react';
import ChatList from './ChatList';
import ChatWindow from './ChatWindow';
import '../styles/Chat.css';

const Chat = () => {
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedRoom, setSelectedRoom] = useState(null);

    const handleSelectUser = (user) => {
        setSelectedUser(user);
        setSelectedRoom(null); // Clear room selection when a user is selected
    };

    const handleSelectRoom = (room) => {
        setSelectedRoom(room);
        setSelectedUser(null); // Clear user selection when a room is selected
    };

    return (
        <div className="chat-app">
            <ChatList onSelectUser={handleSelectUser} onSelectRoom={handleSelectRoom} />
            <ChatWindow
                selectedUser={selectedUser}
                selectedRoom={selectedRoom} // Pass selectedRoom prop
            />
        </div>
    );
};

export default Chat;
