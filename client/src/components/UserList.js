import React from 'react';
import './UserList.css';

function UserList({ users, currentUser }) {
  return (
    <div className="user-list">
      <div className="user-list-header">
        <h3>Online - {users.length}</h3>
      </div>
      <div className="users-container">
        {users.map((user) => (
          <div
            key={user.id}
            className={`user-item ${user.username === currentUser ? 'current-user' : ''}`}
          >
            <div className="user-avatar">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <div className="user-info">
              <span className="user-name">{user.username}</span>
              {user.username === currentUser && (
                <span className="you-badge">(You)</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UserList;
