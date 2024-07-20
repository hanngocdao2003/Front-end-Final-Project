import React, {useEffect, useState} from 'react';
import {useWebSocket} from './WebSocketContext';

const UserList = ({onSelectUser}) => {
    const client = useWebSocket();
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchError, setSearchError] = useState('');

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

                if (dataFromServer.event === 'GET_USER_LIST' && dataFromServer.status === 'success') {
                    setUsers(dataFromServer.data);
                } else {
                    console.error('Unexpected data structure:', dataFromServer);
                }
            };
        }
    }, [client]);

    const handleSearch = () => {
        if (client) {
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

                if (dataFromServer.event === 'CHECK_USER') {
                    if (dataFromServer.status === 'success' && dataFromServer.data.status) {
                        setUsers([dataFromServer.data]);
                        setSearchError('');
                    } else {
                        setSearchError('User not found or there was an error.');
                        setUsers([]);
                    }
                }
            };
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
            {searchError && <p style={{color: 'red'}}>{searchError}</p>}
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
