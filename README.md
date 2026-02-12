# Chat Client - Discord-like Chat Application

A real-time chat application similar to Discord, built with React and Node.js, designed to work reliably without being blocked by content filtering systems.

## Features

- 🔒 **Secure WebSocket Connections**: Uses WSS (WebSocket Secure) over HTTPS to ensure communication isn't blocked
- 💬 **Real-time Messaging**: Instant message delivery using Socket.IO
- 👥 **Multiple Channels**: Create and join multiple chat channels
- 🟢 **Online Users**: See who's currently online
- ⌨️ **Typing Indicators**: See when other users are typing
- 🎨 **Discord-like UI**: Familiar and intuitive interface
- 🔐 **Designed to Bypass Content Filters**: Uses standard HTTPS/WSS protocols that appear as regular web traffic

## Why This Won't Be Blocked by Content Keeper

1. **Standard Protocols**: Uses HTTPS and WSS (WebSocket Secure) which are standard web protocols
2. **Port 443/80**: Can be configured to run on standard web ports (443 for HTTPS, 80 for HTTP)
3. **Looks Like Normal Web Traffic**: The traffic patterns are indistinguishable from regular web browsing
4. **No Special Requirements**: Works with standard web browsers without plugins or special software
5. **Custom Domain Support**: Can be deployed on any domain, making it harder to block by URL filtering

## Architecture

### Backend (Server)
- **Node.js** with Express for the HTTP server
- **Socket.IO** for real-time WebSocket communication
- In-memory storage for messages and users (can be extended with database)

### Frontend (Client)
- **React** for the UI framework
- **Socket.IO Client** for WebSocket connections
- **Responsive Design** with Discord-inspired styling

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/Azazel-Azure/chat.git
cd chat
```

### 2. Install Server Dependencies

```bash
cd server
npm install
```

### 3. Install Client Dependencies

```bash
cd ../client
npm install
```

## Running the Application

### Development Mode

#### Start the Server (Terminal 1)

```bash
cd server
npm start
```

The server will start on `http://localhost:3001`

#### Start the Client (Terminal 2)

```bash
cd client
npm start
```

The client will start on `http://localhost:3000` and automatically open in your browser.

### Production Deployment

#### Build the Client

```bash
cd client
npm run build
```

This creates an optimized production build in the `client/build` folder.

#### Serve the Application

You can serve both the API and the static files from the same server:

1. Copy the build folder to your server
2. Configure your server to:
   - Serve static files from the build folder
   - Proxy WebSocket connections to the Socket.IO server
   - Use HTTPS (required for WSS)

#### Using HTTPS in Production

For production deployment with HTTPS/WSS:

1. Obtain an SSL certificate (e.g., from Let's Encrypt)
2. Configure your Node.js server to use HTTPS:

```javascript
const https = require('https');
const fs = require('fs');

const options = {
  key: fs.readFileSync('path/to/private-key.pem'),
  cert: fs.readFileSync('path/to/certificate.pem')
};

const server = https.createServer(options, app);
```

3. Update the client to connect via `wss://` instead of `ws://`

## Configuration

### Server Configuration

Edit `server/.env`:

```
PORT=3001
NODE_ENV=development
```

### Client Configuration

Edit `client/.env`:

```
REACT_APP_SOCKET_SERVER_URL=http://localhost:3001
```

For production, update this to your server's URL:

```
REACT_APP_SOCKET_SERVER_URL=https://your-domain.com
```

## Usage

1. Open the application in your browser
2. Enter a username to join the chat
3. Start chatting in the default "general" channel
4. Create new channels using the "+" button in the sidebar
5. Switch between channels to participate in different conversations
6. See online users in the right sidebar

## Deployment Options

### Option 1: Heroku

1. Create a Heroku app
2. Deploy the server code
3. Set environment variables
4. Update client to point to Heroku URL

### Option 2: DigitalOcean/AWS/Azure

1. Set up a VPS or cloud instance
2. Install Node.js
3. Clone and build the application
4. Use PM2 or similar to keep the server running
5. Configure nginx as a reverse proxy with SSL

### Option 3: Vercel/Netlify (Frontend) + Heroku/Railway (Backend)

1. Deploy the client to Vercel or Netlify
2. Deploy the server to Heroku or Railway
3. Update environment variables to connect them

## Avoiding Content Filtering

To maximize the chances of bypassing content filtering systems:

1. **Use HTTPS/WSS**: Always use secure connections in production
2. **Standard Ports**: Deploy on port 443 (HTTPS) or 80 (HTTP)
3. **Custom Domain**: Use a legitimate-looking domain name
4. **CDN**: Consider using a CDN like Cloudflare for additional obfuscation
5. **Compression**: Enable gzip compression to make traffic patterns less obvious

## Security Considerations

- Implement proper authentication in production
- Add rate limiting to prevent abuse
- Sanitize user input to prevent XSS attacks
- Use environment variables for sensitive configuration
- Implement CORS properly for your deployment
- Consider adding end-to-end encryption for messages

## Future Enhancements

- [ ] User authentication and registration
- [ ] Persistent message storage with database
- [ ] Direct messaging between users
- [ ] File and image sharing
- [ ] Voice and video chat
- [ ] End-to-end encryption
- [ ] Message editing and deletion
- [ ] Rich text formatting
- [ ] Emoji support
- [ ] User roles and permissions

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for any purpose.

## Support

For issues, questions, or suggestions, please open an issue on GitHub.