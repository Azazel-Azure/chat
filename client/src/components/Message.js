import React from 'react';
import './Message.css';

function Message({ message, isOwnMessage }) {
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`message ${isOwnMessage ? 'own-message' : ''}`}>
      <div className="message-avatar">
        {message.username.charAt(0).toUpperCase()}
      </div>
      <div className="message-content">
        <div className="message-header">
          <span className="message-username">{message.username}</span>
          <span className="message-timestamp">{formatTime(message.timestamp)}</span>
        </div>
        <div className="message-text">{message.content}</div>
      </div>
    </div>
  );
}

export default Message;
