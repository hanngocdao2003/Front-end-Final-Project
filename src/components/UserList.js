import React, { useState, useEffect } from 'react';
import { useWebSocket } from './WebSocketContext';

const UserList = ({ onSelectUser, onCreateRoom }) => {
    const { client, createRoom } = useWebSocket();
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchError, setSearchError] = useState('');
    const [newRoomName, setNewRoomName] = useState('');


    useEffect(() => {
        if (client) {
            client.send(JSON.stringify({
                action: 'onchat',
                data: {
                    event: 'GET_USER_LIST'
                }
            }));

            client.onmessage = (message) => {
                let dataFromServer;
                try {
                    dataFromServer = JSON.parse(message.data);
                } catch (e) {
                    console.error('Failed to parse message:', e);
                    return;
                }

                console.log('Received data:', dataFromServer);

                if (dataFromServer.event === 'GET_USER_LIST' && dataFromServer.status === 'success') {
                    console.log('Users data:', dataFromServer.data);
                    setUsers(dataFromServer.data);
                } else {
                    console.error('Unexpected data structure:', dataFromServer);
                }
            };
        }
    }, [client]);

    const handleSearch = () => {
        if (client && client.readyState === client.OPEN) {
            client.send(JSON.stringify({
                action: 'onchat',
                data: {
                    event: 'CHECK_USER',
                    data: {
                        user: searchTerm
                    }
                }
            }));

            client.onmessage = (message) => {
                let dataFromServer;
                try {
                    dataFromServer = JSON.parse(message.data);
                } catch (e) {
                    console.error('Failed to parse message:', e);
                    return;
                }

                console.log('Received data:', dataFromServer);

                if (dataFromServer.event === 'CHECK_USER') {
                    if (dataFromServer.status === 'success' && dataFromServer.data.status) {
                        console.log('Searched user:', dataFromServer.data);
                        setUsers([dataFromServer.data]); // Assume dataFromServer.data is the user object
                        setSearchError('');
                    } else {
                        console.error('User not found or error:', dataFromServer);
                        setSearchError('User not found or there was an error.');
                        setUsers([]);
                    }
                } else {
                    console.error('Unexpected data structure:', dataFromServer);
                }
            };
        }
    };


    const handleCreateRoom = () => {
        if (client && client.readyState === client.OPEN) {
            createRoom(newRoomName);
            setNewRoomName('');
            onCreateRoom();
        } else {
            console.error('WebSocket connection is not ready');
        }
    };

    const handleSend = () => {
        if (client && client.readyState === WebSocket.OPEN) {
            const message = {
                action: 'onchat',
                data: {
                    event: 'SEND_MESSAGE',
                    data: {
                        "type": "room",
                        "to": "abc",
                        "mes": "hello"
                    },
                },
            };
            client.send(JSON.stringify(message));
        } else if (client && client.readyState === WebSocket.CONNECTING) {

            client.addEventListener('open', () => handleSend());
        } else {
            console.error('WebSocket connection is not ready');
        }
    };

    return (
        <div className="user-list">
            <h2>Users/Groups</h2>
            <input
                type="text"
                placeholder="Search user..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button onClick={handleSearch}>Search</button>
            {searchError && <p style={{ color: 'red' }}>{searchError}</p>}
            <input
                type="text"
                placeholder="New room name..."
                value={newRoomName}
                onChange={(e) => setNewRoomName(e.target.value)}
            />
            <button onClick={handleCreateRoom}>Create Room</button>
            <ul>
                {users.map((user) => (
                    <li key={user.name} onClick={() => onSelectUser(user)}>
                        {user.name}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default UserList;
