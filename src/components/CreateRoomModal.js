import React, {useState, useEffect} from 'react';
import {useWebSocket} from './WebSocketContext';
import '../Chat.css';

const CreateRoomModal = ({onClose, currentUser}) => {
    const [roomName, setRoomName] = useState('');
    const [allUsers, setAllUsers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const client = useWebSocket();

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
                    setAllUsers(dataFromServer.data);
                }
            };
        }
    }, [client]);

    const handleCreateRoom = () => {
        if (client && roomName.trim() !== '') {
            client.send(JSON.stringify({
                action: 'onchat',
                data: {
                    event: 'CREATE_ROOM',
                    data: {
                        name: roomName,
                        users: selectedUsers // Thêm người dùng vào phòng
                    }
                }
            }));
            onClose();
        }
    };

    const handleSelectUser = (user) => {
        setSelectedUsers((prev) => {
            if (prev.includes(user.name)) {
                return prev.filter(u => u !== user.name);
            }
            return [...prev, user.name];
        });
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={onClose}>&times;</span>
                <h2>Create Chat Room</h2>
                <input
                    type="text"
                    placeholder="Room Name"
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                />
                <h3>Select Users to Add</h3>
                <ul>
                    {allUsers.map((user) => (
                        <li key={user.name}>
                            <input
                                type="checkbox"
                                checked={selectedUsers.includes(user.name)}
                                onChange={() => handleSelectUser(user)}
                            />
                            {user.name}
                        </li>
                    ))}
                </ul>
                <button onClick={handleCreateRoom}>Create Room</button>
            </div>
        </div>
    );
};

export default CreateRoomModal;
