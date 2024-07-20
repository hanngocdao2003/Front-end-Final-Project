import React, {useState, useEffect} from 'react';
import UserList from './UserList';
import ChatBox from './ChatBox';
import '../Chat.css';

const Chat = ({currentUser}) => {
    const [selectedUser, setSelectedUser] = useState(null);

    const handleSelectUser = (user) => {
        setSelectedUser(user);
    };

    return (
        <div className="chat-container">
            <div className="user-list-container">
                <UserList onSelectUser={handleSelectUser}/>
            </div>
            <div className="chat-box-container">
                {selectedUser ? (
                    <ChatBox selectedUser={selectedUser} currentUser={currentUser}/>
                ) : (
                    <div>Please select a user to chat with</div>
                )}
            </div>
        </div>
    );
};

export default Chat;
