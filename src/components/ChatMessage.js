import React from 'react';
import '../Chat.css';

const formatDate = (isoString) => {
    const date = new Date(isoString);
    if (isNaN(date)) {
        console.error(`Invalid date: ${isoString}`);
        return 'Unknown time';
    }
    return date.toLocaleDateString([], {year: 'numeric', month: '2-digit', day: '2-digit'}) + ' ' +
        date.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
};

const ChatMessage = ({message, timestamp, isSent}) => {
    const formattedTime = timestamp ? formatDate(timestamp) : 'Unknown time';

    return (
        <div className={`chat-message ${isSent ? 'sent' : 'received'}`}>
            <div className="message-content">{message}</div>
            <div className="message-timestamp">{formattedTime}</div>
        </div>
    );
};

export default ChatMessage;