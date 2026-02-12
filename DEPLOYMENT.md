# Deployment Guide

This guide provides step-by-step instructions for deploying the chat application to various platforms.

## Prerequisites

- Git installed
- Node.js 14+ installed (for local testing)
- Account on your chosen hosting platform

## Quick Start (Local Development)

### 1. Start the Server

```bash
cd server
npm install
npm start
```

Server will run on http://localhost:3001

### 2. Start the Client (in a new terminal)

```bash
cd client
npm install
npm start
```

Client will open at http://localhost:3000

## Production Deployment

### Option 1: Deploy to Heroku (Recommended for Beginners)

#### Deploy the Server

1. Install Heroku CLI: https://devcenter.heroku.com/articles/heroku-cli

2. Login to Heroku:
```bash
heroku login
```

3. Create a new app:
```bash
cd server
heroku create your-chat-server
```

4. Deploy:
```bash
git init
git add .
git commit -m "Initial server deployment"
heroku git:remote -a your-chat-server
git push heroku main
```

5. Your server will be at: https://your-chat-server.herokuapp.com

#### Deploy the Client

1. Update client/.env:
```
REACT_APP_SOCKET_SERVER_URL=https://your-chat-server.herokuapp.com
```

2. Build the client:
```bash
cd client
npm run build
```

3. Deploy to Vercel or Netlify (see below)

### Option 2: Deploy Client to Vercel

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
cd client
vercel
```

3. Follow the prompts and your app will be deployed

### Option 3: Deploy Client to Netlify

1. Install Netlify CLI:
```bash
npm install -g netlify-cli
```

2. Build and deploy:
```bash
cd client
npm run build
netlify deploy --prod --dir=build
```

### Option 4: Deploy to DigitalOcean/AWS/Azure

#### On Your VPS/Cloud Instance

1. Install Node.js:
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

2. Install PM2 (process manager):
```bash
sudo npm install -g pm2
```

3. Clone and setup:
```bash
git clone https://github.com/Azazel-Azure/chat.git
cd chat/server
npm install
```

4. Start with PM2:
```bash
pm2 start server.js --name chat-server
pm2 save
pm2 startup
```

5. Install and configure Nginx:
```bash
sudo apt-get install nginx
```

6. Create Nginx configuration (/etc/nginx/sites-available/chat):
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        root /path/to/chat/client/build;
        try_files $uri $uri/ /index.html;
    }

    location /socket.io/ {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /api/ {
        proxy_pass http://localhost:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

7. Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/chat /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

8. Install SSL certificate (Let's Encrypt):
```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

## Environment Variables

### Server (.env)
```
PORT=3001
NODE_ENV=production
```

### Client (.env)
```
REACT_APP_SOCKET_SERVER_URL=https://your-domain.com
```

## Domain Configuration

### Using Cloudflare (Recommended)

1. Add your site to Cloudflare
2. Update your domain's nameservers
3. Enable SSL/TLS (Full or Full Strict)
4. Enable these features:
   - Auto Minify (JS, CSS, HTML)
   - Brotli compression
   - HTTP/2
   - WebSockets

5. Configure DNS:
   - A record: @ -> Your server IP
   - CNAME: www -> your-domain.com

## Monitoring and Maintenance

### Check Server Status (PM2)
```bash
pm2 status
pm2 logs chat-server
pm2 monit
```

### Update Application
```bash
cd /path/to/chat
git pull
cd server && npm install
pm2 restart chat-server
```

### View Nginx Logs
```bash
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

## Security Checklist

- [ ] SSL/TLS certificate installed and configured
- [ ] Firewall configured (allow only 80, 443, and SSH)
- [ ] Keep Node.js and dependencies updated
- [ ] Use strong passwords for server access
- [ ] Regular backups of any stored data
- [ ] Monitor server logs for suspicious activity
- [ ] Consider implementing rate limiting
- [ ] Add authentication if needed

## Troubleshooting

### WebSocket Connection Fails

1. Check Nginx configuration for WebSocket support
2. Verify firewall allows WebSocket connections
3. Check browser console for errors
4. Test with `wscat` or similar tool

### Client Can't Connect to Server

1. Verify REACT_APP_SOCKET_SERVER_URL is correct
2. Check CORS configuration on server
3. Verify server is running: `curl http://localhost:3001/health`
4. Check browser console for errors

### SSL Certificate Issues

1. Verify certificate is valid: `sudo certbot certificates`
2. Renew if needed: `sudo certbot renew`
3. Check Nginx SSL configuration

## Performance Optimization

### For High Traffic

1. **Use Redis for session storage**:
   - Install Redis
   - Update server to use Redis adapter for Socket.IO

2. **Load balancing**:
   - Deploy multiple server instances
   - Use Nginx or a load balancer to distribute traffic

3. **CDN for static assets**:
   - Use Cloudflare or another CDN
   - Cache static files aggressively

4. **Database for message persistence**:
   - Add MongoDB or PostgreSQL
   - Store message history
   - Implement pagination

## Cost Estimates

### Free Tier Options
- **Heroku**: Free for small apps (sleeps after 30 min inactivity)
- **Vercel/Netlify**: Free tier available for frontend
- **Cloudflare**: Free tier includes CDN and basic DDoS protection

### Paid Options
- **DigitalOcean Droplet**: $5-10/month for small VPS
- **AWS/Azure**: $10-50/month depending on usage
- **Heroku Hobby**: $7/month (doesn't sleep)

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review server logs
3. Check GitHub issues
4. Open a new issue with details

## Next Steps

After deployment:
1. Test the application thoroughly
2. Share the URL with users
3. Monitor for issues
4. Consider adding features like:
   - User authentication
   - Message persistence
   - File uploads
   - Rich text formatting