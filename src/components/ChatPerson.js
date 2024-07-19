// ChatPerson.js
import React from 'react';

const ChatPerson = ({ name, onClick }) => {
    return (
        <div className="chat-person" onClick={onClick}>
            {name}
        </div>
    );
};

export default ChatPerson;
