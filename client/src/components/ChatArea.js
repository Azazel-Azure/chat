import React, { useState, useRef, useEffect } from 'react';
import './ChatArea.css';
import Message from './Message';

function ChatArea({ messages, currentChannel, username, onSendMessage, onTyping, typingUsers }) {
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputMessage.trim()) {
      onSendMessage(inputMessage);
      setInputMessage('');
    }
  };

  const handleInputChange = (e) => {
    setInputMessage(e.target.value);
    onTyping();
  };

  return (
    <div className="chat-area">
      <div className="chat-header">
        <span className="channel-icon">#</span>
        <h3>{currentChannel}</h3>
      </div>
      
      <div className="messages-container">
        {messages.length === 0 ? (
          <div className="no-messages">
            <p>Welcome to #{currentChannel}!</p>
            <p>This is the start of the conversation.</p>
          </div>
        ) : (
          messages.map((message) => (
            <Message
              key={message.id}
              message={message}
              isOwnMessage={message.username === username}
            />
          ))
        )}
        
        {typingUsers.length > 0 && (
          <div className="typing-indicator">
            <span>
              {typingUsers.map(u => u.username).join(', ')} 
              {typingUsers.length === 1 ? ' is' : ' are'} typing...
            </span>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      <div className="message-input-container">
        <form onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            type="text"
            placeholder={`Message #${currentChannel}`}
            value={inputMessage}
            onChange={handleInputChange}
            maxLength={2000}
          />
          <button type="submit" disabled={!inputMessage.trim()}>
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

export default ChatArea;
