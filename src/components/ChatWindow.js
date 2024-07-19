import React, { useEffect, useState, useRef } from 'react';
import webSocketService from '../services/WebSocketService';
import '../styles/ChatWindow.css';

const ChatWindow = ({ selectedUser }) => {
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const endOfMessagesRef = useRef(null); // Ref to the end of messages

  useEffect(() => {
    if (selectedUser) {
      // Request chat history for the selected user
      webSocketService.getChatHistory(selectedUser.name);

      // Set up WebSocket callback for chat history
      const handleChatHistoryResponse = (data) => {
        if (data.event === 'GET_PEOPLE_CHAT_MES' && data.status === 'success') {
          // Sort messages in ascending order (oldest first)
          const sortedMessages = data.data.sort((a, b) => new Date(a.createAt) - new Date(b.createAt));
          setMessages(sortedMessages);
        } else {
          console.error('Unexpected chat history data:', data);
        }
      };

      webSocketService.setChatHistoryResponseCallback(handleChatHistoryResponse);

      return () => {
        console.log('Cleaning up chat history response callback');
        webSocketService.setChatHistoryResponseCallback(null);
      };
    }
  }, [selectedUser]);

  useEffect(() => {
    // Scroll to the bottom when messages are updated
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear().toString().slice(-2); // Get last 2 digits of year
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${day}/${month}/${year} - ${hours}:${minutes}:${seconds}`;
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
      name: 'Me', // Assume the sender is 'Me', replace with actual sender name
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
          mes: messageInput
        }
      }
    };

    // Send the message using WebSocket service
    webSocketService.send(messageData);

    // Clear the input field
    setMessageInput('');

    // Optionally refetch messages to ensure consistency
    // webSocketService.getChatHistory(selectedUser.name);
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
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatWindow;
