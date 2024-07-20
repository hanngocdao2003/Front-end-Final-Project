import React, {useEffect, useState} from 'react';
import {useWebSocket} from './WebSocketContext';
import '../Chat.css';

const UserList = ({onSelectUser}) => {
    const client = useWebSocket();
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchError, setSearchError] = useState('');
    const [isSearching, setIsSearching] = useState(false);

    useEffect(() => {
        const fetchUserList = () => {
            if (client) {
                client.send(JSON.stringify({
                    action: 'onchat',
                    data: {
                        event: 'GET_USER_LIST'
                    }
                }));
            }
        };

        const handleUserList = (message) => {
            let dataFromServer;
            try {
                dataFromServer = JSON.parse(message.data);
            } catch (e) {
                console.error('Failed to parse message:', e);
                return;
            }

            if (dataFromServer.event === 'GET_USER_LIST' && dataFromServer.status === 'success') {
                const usersList = Array.isArray(dataFromServer.data) ? dataFromServer.data : [];
                // Ensure all users have the name property
                const validUsers = usersList.filter(user => user && typeof user.name === 'string');
                setUsers(validUsers);
                setFilteredUsers(validUsers);
            } else {
                console.error('Unexpected data structure:', dataFromServer);
            }
        };

        if (client) {
            client.onmessage = (message) => {
                if (message.data.includes('GET_USER_LIST')) {
                    handleUserList(message);
                } else if (message.data.includes('REGISTER') || message.data.includes('LOGIN')) {
                    // If registration or login, fetch the updated user list
                    fetchUserList();
                }
            };

            // Request the initial user list
            fetchUserList();
        }

        return () => {
            if (client) {
                client.onmessage = null;
            }
        };
    }, [client]);

    const handleSearch = () => {
        if (searchTerm.trim() === '') {
            setFilteredUsers(users);
            setSearchError('');
            return;
        }

        const filtered = users.filter(user =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase())
        );

        if (filtered.length > 0) {
            setFilteredUsers(filtered);
            setSearchError('');
        } else {
            setFilteredUsers([]);
            setSearchError('User not found.');
        }

        setIsSearching(true);
    };

    const handleBack = () => {
        setIsSearching(false);
        setSearchTerm('');
        setSearchError('');
        // Reset filtered users to show the full user list
        setFilteredUsers(users);
    };

    return (
        <div className="user-list">
            <h2>Users/Groups</h2>
            <div>
                <input
                    type="text"
                    placeholder="Search user..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button onClick={handleSearch}>Search</button>
                {isSearching && <button onClick={handleBack}>Back</button>}
                {searchError && <p style={{color: 'red'}}>{searchError}</p>}
            </div>
            <ul>
                {filteredUsers.length > 0 ? (
                    filteredUsers.map((user, index) => {
                        if (user && user.name) {
                            return (
                                <li key={user.name + index} onClick={() => onSelectUser(user)}>
                                    {user.name}
                                </li>
                            );
                        } else {
                            console.warn('User is undefined or missing name:', user);
                            return null;
                        }
                    })
                ) : (
                    <p>No users found.</p>
                )}
            </ul>
        </div>
    );
};

export default UserList;
