import React, { useState, useEffect } from 'react';
import ChatPerson from './ChatPerson';
import webSocketService from '../services/WebSocketService';

const ChatList = ({ onSelectUser }) => {
  const [people, setUsers] = useState([]);

  useEffect(() => {
    const handleUserListResponse = (data) => {
      if (data.event === 'GET_USER_LIST' && data.status === 'success') {
        const sortedUsers = data.data.sort((user1, user2) => user2.actionTime - user1.actionTime);
        setUsers(sortedUsers);
      } else {
        console.error('Unexpected data structure:', data);
      }
    };

    const initializeWebSocket = () => {
      if (!webSocketService.socket || webSocketService.socket.readyState !== WebSocket.OPEN) {
        webSocketService.connect('ws://140.238.54.136:8080/chat/chat');
      }
      webSocketService.setUserListResponseCallback(handleUserListResponse);
      webSocketService.getUserList();
    };

    initializeWebSocket();

    return () => {
      webSocketService.setUserListResponseCallback(null);
    };
  }, []);

  return (
    <div className="chat-list">
      {people.map((user) => (
        <ChatPerson
          key={user.name}
          name={user.name}
          latestMessage={user.latestMessage}
          onClick={() => onSelectUser(user)}
        />
      ))}
    </div>
  );
};

export default ChatList;
