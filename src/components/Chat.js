import React from 'react'
import { useState } from 'react';
import ChatList from './ChatList';
import ChatWindow from './ChatWindow';
import '../styles/Chat.css';

const Chat = () => {
    const [selectedUser, setSelectedUser] = useState(null);

    const handleSelectUser = (user) => {
      setSelectedUser(user);
    };
  
    return (
      <div className="chat-app">
        <ChatList onSelectUser={handleSelectUser} />
        {selectedUser && <ChatWindow selectedUser={selectedUser} />}
      </div>
    );
};

export default Chat;