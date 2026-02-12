import React, { useState } from 'react';
import './Sidebar.css';

function Sidebar({ channels, currentChannel, onChannelChange, onCreateChannel }) {
  const [isCreatingChannel, setIsCreatingChannel] = useState(false);
  const [newChannelName, setNewChannelName] = useState('');

  const handleCreateChannel = async (e) => {
    e.preventDefault();
    if (newChannelName.trim()) {
      const result = await onCreateChannel(newChannelName.trim());
      if (result) {
        setNewChannelName('');
        setIsCreatingChannel(false);
      }
    }
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>Chat Channels</h2>
      </div>
      
      <div className="channels-list">
        <div className="channels-header">
          <span>TEXT CHANNELS</span>
          <button 
            className="add-channel-btn"
            onClick={() => setIsCreatingChannel(!isCreatingChannel)}
            title="Create Channel"
          >
            +
          </button>
        </div>
        
        {isCreatingChannel && (
          <form onSubmit={handleCreateChannel} className="create-channel-form">
            <input
              type="text"
              placeholder="Channel name"
              value={newChannelName}
              onChange={(e) => setNewChannelName(e.target.value)}
              autoFocus
              maxLength={30}
            />
            <div className="form-buttons">
              <button type="submit" className="btn-create">Create</button>
              <button 
                type="button" 
                className="btn-cancel"
                onClick={() => {
                  setIsCreatingChannel(false);
                  setNewChannelName('');
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
        
        {channels.map((channel) => (
          <div
            key={channel.id}
            className={`channel-item ${currentChannel === channel.id ? 'active' : ''}`}
            onClick={() => onChannelChange(channel.id)}
          >
            <span className="channel-icon">#</span>
            <span className="channel-name">{channel.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Sidebar;
