import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import './App.css';
import ChatArea from './components/ChatArea';
import Sidebar from './components/Sidebar';
import UserList from './components/UserList';
import LoginModal from './components/LoginModal';

// Configure server URL - uses environment variable or defaults to localhost
const SOCKET_SERVER_URL = process.env.REACT_APP_SOCKET_SERVER_URL || 'http://localhost:3001';

function App() {
  const [socket, setSocket] = useState(null);
  const [username, setUsername] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [messages, setMessages] = useState([]);
  const [channels, setChannels] = useState([]);
  const [currentChannel, setCurrentChannel] = useState('general');
  const [users, setUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    // Initialize socket connection when logged in
    if (isLoggedIn && !socket) {
      const newSocket = io(SOCKET_SERVER_URL, {
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 10
      });
      
      setSocket(newSocket);
      
      // Join with username
      newSocket.emit('join', username);
      
      return () => {
        newSocket.close();
      };
    }
  }, [isLoggedIn, username, socket]);

  useEffect(() => {
    if (!socket) return;

    // Listen for channels list
    socket.on('channels_list', (channelsList) => {
      setChannels(channelsList);
    });

    // Listen for new channels
    socket.on('channel_created', (channel) => {
      setChannels(prev => [...prev, channel]);
    });

    // Listen for message history
    socket.on('message_history', (data) => {
      if (data.channelId === currentChannel) {
        setMessages(data.messages);
      }
    });

    // Listen for new messages
    socket.on('new_message', (message) => {
      if (message.channelId === currentChannel) {
        setMessages(prev => [...prev, message]);
      }
    });

    // Listen for users update
    socket.on('users_update', (usersList) => {
      setUsers(usersList);
    });

    // Listen for user joined
    socket.on('user_joined', (data) => {
      console.log(data.message);
    });

    // Listen for user left
    socket.on('user_left', (data) => {
      console.log(data.message);
    });

    // Listen for typing indicators
    socket.on('user_typing', (data) => {
      if (data.channelId === currentChannel) {
        setTypingUsers(prev => {
          if (!prev.find(u => u.userId === data.userId)) {
            return [...prev, data];
          }
          return prev;
        });
      }
    });

    socket.on('user_stop_typing', (data) => {
      if (data.channelId === currentChannel) {
        setTypingUsers(prev => prev.filter(u => u.userId !== data.userId));
      }
    });

    return () => {
      socket.off('channels_list');
      socket.off('channel_created');
      socket.off('message_history');
      socket.off('new_message');
      socket.off('users_update');
      socket.off('user_joined');
      socket.off('user_left');
      socket.off('user_typing');
      socket.off('user_stop_typing');
    };
  }, [socket, currentChannel]);

  useEffect(() => {
    // Join current channel when it changes
    if (socket && currentChannel) {
      socket.emit('join_channel', currentChannel);
      setMessages([]);
      setTypingUsers([]);
      
      return () => {
        socket.emit('leave_channel', currentChannel);
      };
    }
  }, [socket, currentChannel]);

  const handleLogin = (enteredUsername) => {
    setUsername(enteredUsername);
    setIsLoggedIn(true);
  };

  const handleSendMessage = (content) => {
    if (socket && content.trim()) {
      socket.emit('message', {
        channelId: currentChannel,
        content: content,
        encrypted: false
      });
    }
  };

  const handleChannelChange = (channelId) => {
    setCurrentChannel(channelId);
  };

  const handleCreateChannel = async (channelName) => {
    try {
      const response = await fetch(`${SOCKET_SERVER_URL}/api/channels`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: channelName }),
      });
      
      if (response.ok) {
        const newChannel = await response.json();
        return newChannel;
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to create channel');
        return null;
      }
    } catch (error) {
      console.error('Error creating channel:', error);
      alert('Failed to create channel');
      return null;
    }
  };

  const handleTyping = () => {
    if (socket) {
      socket.emit('typing', { channelId: currentChannel });
      
      // Clear existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      // Set new timeout to stop typing
      typingTimeoutRef.current = setTimeout(() => {
        socket.emit('stop_typing', { channelId: currentChannel });
      }, 1000);
    }
  };

  if (!isLoggedIn) {
    return <LoginModal onLogin={handleLogin} />;
  }

  return (
    <div className="app">
      <Sidebar
        channels={channels}
        currentChannel={currentChannel}
        onChannelChange={handleChannelChange}
        onCreateChannel={handleCreateChannel}
      />
      <ChatArea
        messages={messages}
        currentChannel={currentChannel}
        username={username}
        onSendMessage={handleSendMessage}
        onTyping={handleTyping}
        typingUsers={typingUsers}
      />
      <UserList users={users} currentUser={username} />
    </div>
  );
}

export default App;
