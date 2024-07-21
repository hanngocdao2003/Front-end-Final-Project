import React, { useEffect, useState, useRef } from 'react';
import webSocketService from '../services/WebSocketService';
import '../styles/ChatWindow.css';

const ChatWindow = ({ selectedUser, selectedRoom }) => {
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const endOfMessagesRef = useRef(null);
  const currentUser = localStorage.getItem('username');
  const [roomMessages, setRoomMessages] = useState([]);

  useEffect(() => {
    if (selectedUser) {
      console.log('Fetching user chat history...');
      webSocketService.getChatHistory(selectedUser.name);
    } else if (selectedRoom) {
      console.log('Fetching room chat history...');
      webSocketService.sendGetRoomChatHistory(selectedRoom.name);
    }

    const handleChatHistoryResponse = (data) => {
      console.log('Chat History Response:', data);

      if (data.event === 'GET_PEOPLE_CHAT_MES' && data.status === 'success') {
        const sortedMessages = data.data.sort((a, b) => new Date(a.createAt) - new Date(b.createAt));
        setMessages(sortedMessages);
      } else if (data.event === 'GET_ROOM_CHAT_MES' && data.status === 'success') {
        const messages = Array.isArray(data.data.chatData) ? data.data.chatData : [];
        const sortedMessages = messages.sort((a, b) => new Date(a.createAt) - new Date(b.createAt));
        setRoomMessages(sortedMessages);
      } else {
        console.error('Unexpected chat history data:', data);
      }
    };

    webSocketService.setChatHistoryResponseCallback(handleChatHistoryResponse);
    webSocketService.setRoomChatHistoryResponseCallback(handleChatHistoryResponse);

    const handleNewMessage = (newMessage) => {
      console.log('New Message:', newMessage);

      if (newMessage.to === selectedUser?.name || newMessage.name === selectedUser?.name) {
        setMessages((prevMessages) => [...prevMessages, newMessage].sort((a, b) => new Date(a.createAt) - new Date(b.createAt)));
      } else if (newMessage.to === selectedRoom?.name) {
        setRoomMessages((prevMessages) => [...prevMessages, newMessage].sort((a, b) => new Date(a.createAt) - new Date(b.createAt)));
      }
    };

    webSocketService.setNewMessageCallback(handleNewMessage);

    return () => {
      webSocketService.setChatHistoryResponseCallback(null);
      webSocketService.setNewMessageCallback(null);
    };
  }, [selectedUser, selectedRoom]);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, roomMessages]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date)) return 'Now';
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - offset * 60 * 1000 + 7 * 60 * 60 * 1000);

    const day = String(localDate.getDate()).padStart(2, '0');
    const month = String(localDate.getMonth() + 1).padStart(2, '0');
    const year = localDate.getFullYear().toString().slice(-2);
    // const hours = String(localDate.getHours()).padStart(2, '0');
    // const minutes = String(localDate.getMinutes()).padStart(2, '0');
    // const seconds = String(localDate.getSeconds()).padStart(2, '0');

    return `${day}/${month}/${year} `;
  };

  const handleInputChange = (e) => {
    setMessageInput(e.target.value);
  };

  const handleSendMessage = () => {
    if (messageInput.trim() === '') {
      return;
    }

    const newMessage = {
      id: Date.now(),
      name: currentUser,
      mes: messageInput,
      createAt: new Date().toISOString(),
    };

    if (selectedUser) {
      setMessages([...messages, newMessage]);

      const messageData = {
        action: 'onchat',
        data: {
          event: 'SEND_CHAT',
          data: {
            type: 'people',
            to: selectedUser.name,
            mes: messageInput,
            createAt: new Date().toISOString()
          }
        }
      };

      webSocketService.send(messageData);
    } else if (selectedRoom) {
      setRoomMessages([...roomMessages, newMessage]);

      const messageData = {
        action: 'onchat',
        data: {
          event: 'SEND_CHAT',
          data: {
            type: 'room',
            to: selectedRoom.name,
            mes: messageInput,
            createAt: new Date().toISOString()
          }
        }
      };

      webSocketService.send(messageData);
    }

    setMessageInput('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="chat-window">
      <div className="chat-messages">
        {selectedUser && messages.map((message) => (
          <div key={message.id} className="message">
            <div className="message-header">
              <div className="sender-name">{message.name}</div>
            </div>
            <div className="message-content">
              {message.mes}
              <div className="timestamp">{formatDate(message.createAt)}</div>
            </div>
          </div>
        ))}
        {selectedRoom && roomMessages.map((message) => (
          <div key={message.id} className="message">
            <div className="message-header">
              <div className="sender-name">{message.name}</div>
            </div>
            <div className="message-content">
              {message.mes}
              <div className="timestamp">{formatDate(message.createAt)}</div>
            </div>
          </div>
        ))}
        <div ref={endOfMessagesRef} /> {/* Empty div to scroll into view */}
      </div>
      <div className="chat-input">
        <input
          type="text"
          placeholder="Type your message..."
          value={messageInput}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown} // Add keydown event handler
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatWindow;
