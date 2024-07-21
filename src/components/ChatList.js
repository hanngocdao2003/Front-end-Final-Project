import React, { useState, useEffect } from 'react';
import ChatPerson from './ChatPerson';
import ChatRoom from './ChatRoom';
import webSocketService from '../services/WebSocketService';
import '../styles/ChatList.css';

const ChatList = ({ onSelectUser }) => {
  const [people, setPeople] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [view, setView] = useState('people');
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [roomMessages, setRoomMessages] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const handleUserListResponse = (data) => {
      if (data.event === 'GET_USER_LIST' && data.status === 'success') {
        const sortedUsers = data.data.sort((user1, user2) => user2.actionTime - user1.actionTime);
        setPeople(sortedUsers);
      } else {
        console.error('Unexpected data structure:', data);
      }
    };

    const handleJoinRoomResponse = (data) => {
      if (data.event === 'JOIN_ROOM' && data.status === 'success') {
        const newRoom = {
          id: data.data.id,
          name: data.data.name,
        };
        setRooms((prevRooms) => [...prevRooms, newRoom]);
      }
    };

    const handleRoomChatHistoryResponse = (data) => {
      if (data.event === 'GET_ROOM_CHAT_MES' && data.status === 'success') {
        setRoomMessages(data.data.messages); // Assuming 'messages' is the key containing chat history
      }
    };

    const initializeWebSocket = () => {
      if (!webSocketService.socket || webSocketService.socket.readyState !== WebSocket.OPEN) {
        webSocketService.connect('ws://140.238.54.136:8080/chat/chat');
      }
      webSocketService.setUserListResponseCallback(handleUserListResponse);
      webSocketService.setJoinRoomResponseCallback(handleJoinRoomResponse);
      webSocketService.setRoomChatHistoryResponseCallback(handleRoomChatHistoryResponse);
      webSocketService.getUserList(); // Initial fetch for user list
    };

    initializeWebSocket();

    return () => {
      webSocketService.setUserListResponseCallback(null);
      webSocketService.setJoinRoomResponseCallback(null);
      webSocketService.setRoomChatHistoryResponseCallback(null);
    };
  }, []);

  const handleToggle = (viewType) => {
    setView(viewType);
  };

  const handleRoomClick = (roomName) => {
    setSelectedRoom(roomName);
    webSocketService.sendGetRoomChatHistory(roomName);
  };

  const filteredPeople = people.filter(user =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredRooms = rooms.filter(room =>
      room.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
      <div className="chat-list">
        <div className="toggle-container">
          <button
              onClick={() => handleToggle('people')}
              className={`toggle-button ${view === 'people' ? 'active' : ''}`}
          >
            People
          </button>
          <button
              onClick={() => handleToggle('rooms')}
              className={`toggle-button ${view === 'rooms' ? 'active' : ''}`}
          >
            Rooms
          </button>
        </div>
        <div className="search-container">
          <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={handleSearchChange}
              className='search-input'
          />
        </div>
        <div className="list-content">
          {view === 'people' ? (
              filteredPeople.map((user) => (
                  <ChatPerson
                      key={user.id}
                      name={user.name}
                      latestMessage={user.latestMessage}
                      onClick={() => onSelectUser(user)}
                  />
              ))
          ) : (
              filteredRooms.map((room) => (
                  <ChatRoom
                      key={room.id}
                      name={room.name}
                      onClick={() => handleRoomClick(room.name)}
                  />
              ))
          )}
        </div>
        {selectedRoom && (
            <div className="room-messages">
              <h3>Chat History for {selectedRoom}</h3>
              <ul>
                {roomMessages.map((message, index) => (
                    <li key={index}>{message}</li> // Adjust according to the message structure
                ))}
              </ul>
            </div>
        )}
      </div>
  );
};

export default ChatList;
