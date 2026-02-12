const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');

const app = express();
const server = http.createServer(app);

// CORS configuration - allows requests from frontend
app.use(cors());
app.use(express.json());

// Socket.IO with CORS enabled
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  },
  // Use WSS in production (secure WebSocket)
  transports: ['websocket', 'polling']
});

// In-memory storage (in production, use a database)
const users = new Map();
const channels = new Map();
const messages = new Map();

// Create default channel
const defaultChannel = {
  id: 'general',
  name: 'general',
  messages: []
};
channels.set('general', defaultChannel);
messages.set('general', []);

// Basic health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Chat server is running' });
});

// API endpoint to get channels
app.get('/api/channels', (req, res) => {
  const channelList = Array.from(channels.values());
  res.json(channelList);
});

// API endpoint to create channel
app.post('/api/channels', (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Channel name is required' });
  }
  
  const channelId = name.toLowerCase().replace(/\s+/g, '-');
  if (channels.has(channelId)) {
    return res.status(409).json({ error: 'Channel already exists' });
  }
  
  const channel = {
    id: channelId,
    name: name,
    messages: []
  };
  
  channels.set(channelId, channel);
  messages.set(channelId, []);
  
  io.emit('channel_created', channel);
  res.json(channel);
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);
  
  // Handle user join
  socket.on('join', (username) => {
    const userId = socket.id;
    const user = {
      id: userId,
      username: username || `User${Date.now()}`,
      socketId: socket.id
    };
    
    users.set(userId, user);
    socket.username = user.username;
    socket.userId = userId;
    
    // Send user list to all clients
    io.emit('users_update', Array.from(users.values()));
    
    // Send join notification
    io.emit('user_joined', {
      user: user,
      message: `${user.username} joined the chat`
    });
    
    // Send existing channels to the new user
    socket.emit('channels_list', Array.from(channels.values()));
  });
  
  // Handle joining a channel
  socket.on('join_channel', (channelId) => {
    socket.join(channelId);
    
    // Send message history for this channel
    const channelMessages = messages.get(channelId) || [];
    socket.emit('message_history', {
      channelId: channelId,
      messages: channelMessages
    });
  });
  
  // Handle leaving a channel
  socket.on('leave_channel', (channelId) => {
    socket.leave(channelId);
  });
  
  // Handle new message
  socket.on('message', (data) => {
    const { channelId, content, encrypted } = data;
    
    const message = {
      id: uuidv4(),
      userId: socket.userId,
      username: socket.username,
      content: content,
      encrypted: encrypted || false,
      timestamp: new Date().toISOString(),
      channelId: channelId
    };
    
    // Store message
    if (!messages.has(channelId)) {
      messages.set(channelId, []);
    }
    messages.get(channelId).push(message);
    
    // Broadcast to all clients in the channel
    io.to(channelId).emit('new_message', message);
  });
  
  // Handle typing indicator
  socket.on('typing', (data) => {
    socket.to(data.channelId).emit('user_typing', {
      userId: socket.userId,
      username: socket.username,
      channelId: data.channelId
    });
  });
  
  // Handle stop typing
  socket.on('stop_typing', (data) => {
    socket.to(data.channelId).emit('user_stop_typing', {
      userId: socket.userId,
      channelId: data.channelId
    });
  });
  
  // Handle disconnect
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
    
    if (socket.userId) {
      const user = users.get(socket.userId);
      users.delete(socket.userId);
      
      if (user) {
        io.emit('user_left', {
          user: user,
          message: `${user.username} left the chat`
        });
      }
      
      // Update user list
      io.emit('users_update', Array.from(users.values()));
    }
  });
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`Chat server running on port ${PORT}`);
  console.log(`WebSocket server ready for connections`);
});
