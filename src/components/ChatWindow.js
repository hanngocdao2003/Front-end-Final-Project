import React from 'react';

const ChatWindow = () => {
    return (
        <div className="chat-window">
            <div className="chat-messages">
                {/* Messages will be rendered here */}
                <div className="message">Hello, how are you?</div>
                <div className="message">I'm good, thanks!</div>
            </div>
            <div className="chat-input">
                <input type="text" placeholder="Type your message..." />
                <button>Send</button>
            </div>
        </div>
    );
};

export default ChatWindow;