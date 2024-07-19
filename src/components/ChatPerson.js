import React from 'react';

const ChatPerson = ({ name, latestMessage, onClick }) => {
  return (
    <div className="chat-person" onClick={onClick}>
      <div className="chat-person-name">{name}</div>
      {latestMessage && (
        <div className="chat-person-latest-message">{latestMessage.text}</div>
      )}
    </div>
  );
};

export default ChatPerson;
