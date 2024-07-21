import React, { useState, useEffect } from 'react';
import ChatPerson from './ChatPerson';
import ChatRoom from './ChatRoom';
import webSocketService from '../services/WebSocketService';
import '../styles/ChatList.css';

const ChatList = ({ onSelectUser, onSelectRoom }) => {
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


    const initializeWebSocket = () => {
      if (!webSocketService.socket || webSocketService.socket.readyState !== WebSocket.OPEN) {
        webSocketService.connect('ws://140.238.54.136:8080/chat/chat');
      }
      webSocketService.setUserListResponseCallback(handleUserListResponse);
      webSocketService.setJoinRoomResponseCallback(handleJoinRoomResponse);
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
              onClick={() => onSelectRoom(room)}
            />
          ))
        )}
      </div>
      {/* {selectedRoom && (
        <div className="room-messages">
          <h3>Chat History for {selectedRoom}</h3>
          <ul>
            {roomMessages.map((message) => (
              <li key={message.id}>
                <div className="message-header">
                  <div className="sender-name">{message.name}</div>
                </div>
                <div className="message-content">
                  {message.mes}
                  <div className="timestamp">{formatDate(message.createAt)}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )} */}
    </div>
  );
};

export default ChatList;
