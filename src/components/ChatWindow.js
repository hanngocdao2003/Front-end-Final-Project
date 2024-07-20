import React, { useEffect, useState, useRef } from 'react';
import webSocketService from '../services/WebSocketService';
import '../styles/ChatWindow.css';

const ChatWindow = ({ selectedUser }) => {
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const endOfMessagesRef = useRef(null);
  const currentUser = localStorage.getItem('username'); // Get current username

  useEffect(() => {
    if (selectedUser) {
      // Request chat history for the selected user
      webSocketService.getChatHistory(selectedUser.name);

      // Set up WebSocket callback for chat history
      const handleChatHistoryResponse = (data) => {
        if (data.event === 'GET_PEOPLE_CHAT_MES' && data.status === 'success') {
          const sortedMessages = data.data.sort((a, b) => new Date(a.createAt) - new Date(b.createAt));
          setMessages(sortedMessages);
        } else {
          console.error('Unexpected chat history data:', data);
        }
      };

      webSocketService.setChatHistoryResponseCallback(handleChatHistoryResponse);

      // Set up WebSocket callback for new messages
      const handleNewMessage = (newMessage) => {
        console.log('New message received:', newMessage);
        if (newMessage.to === selectedUser.name || newMessage.name === selectedUser.name) {
          const messageWithTimestamp = {
            ...newMessage,
            createAt: newMessage.createAt || new Date().toISOString(),
          };
          setMessages(prevMessages => [...prevMessages, messageWithTimestamp].sort((a, b) => new Date(a.createAt) - new Date(b.createAt)));
        }
      };

      webSocketService.setNewMessageCallback(handleNewMessage);

      return () => {
        webSocketService.setChatHistoryResponseCallback(null);
        webSocketService.setNewMessageCallback(null); // Clean up new message callback
      };
    }
  }, [selectedUser]);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date)) return 'Invalid Date';
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - offset * 60 * 1000 + 7 * 60 * 60 * 1000); // Adjust to GMT+7

    const day = String(localDate.getDate()).padStart(2, '0');
    const month = String(localDate.getMonth() + 1).padStart(2, '0');
    const year = localDate.getFullYear().toString().slice(-2); // Get last 2 digits of year
    const hours = String(localDate.getHours()).padStart(2, '0');
    const minutes = String(localDate.getMinutes()).padStart(2, '0');
    const seconds = String(localDate.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  const handleInputChange = (e) => {
    setMessageInput(e.target.value);
  };

  const handleSendMessage = () => {
    if (messageInput.trim() === '') {
      return;
    }

    const newMessage = {
      id: Date.now(), // Temporary ID, replace with server ID if available
      name: currentUser, // Use current user's name
      mes: messageInput,
      createAt: new Date().toISOString(), // Current timestamp
    };

    // Optimistically add the new message to the messages list
    setMessages([...messages, newMessage]);

    // Prepare message data
    const messageData = {
      action: 'onchat',
      data: {
        event: 'SEND_CHAT',
        data: {
          type: 'people',
          to: selectedUser.name,
          mes: messageInput,
          createAt: new Date().toISOString() // Add timestamp to the message
        }
      }
    };

    // Send the message using WebSocket service
    webSocketService.send(messageData);

    // Clear the input field
    setMessageInput('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent default behavior (e.g., form submission)
      handleSendMessage(); // Send the message
    }
  };

  return (
    <div className="chat-window">
      <div className="chat-messages">
        {messages.map((message) => (
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
