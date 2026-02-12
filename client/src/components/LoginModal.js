import React, { useState } from 'react';
import './LoginModal.css';

function LoginModal({ onLogin }) {
  const [username, setUsername] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username.trim()) {
      onLogin(username.trim());
    }
  };

  return (
    <div className="login-modal-overlay">
      <div className="login-modal">
        <h1>Welcome to Chat</h1>
        <p>Enter your username to get started</p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoFocus
            maxLength={20}
          />
          <button type="submit" disabled={!username.trim()}>
            Join Chat
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginModal;
