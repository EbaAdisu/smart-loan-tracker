# Deployment Guide - Smart Loan Tracker Backend

## 🚀 Deployment Options

### Option 1: Deploy to Railway.app (Recommended)

Railway.app provides easy deployment with MongoDB integration.

1. **Create Railway Account**: [railway.app](https://railway.app)

2. **Install Railway CLI**:
```bash
npm i -g @railway/cli
```

3. **Login and Initialize**:
```bash
railway login
railway init
```

4. **Add MongoDB Service**:
- Go to your project dashboard
- Click "New" → "Database" → "Add MongoDB"
- Copy the `MONGODB_URI` from the MongoDB service

5. **Set Environment Variables**:
```bash
railway variables set MONGODB_URI="your-mongodb-uri"
railway variables set BETTER_AUTH_SECRET="your-secret-key"
railway variables set BETTER_AUTH_URL="https://your-app.railway.app"
railway variables set EXPO_ACCESS_TOKEN="your-expo-token"
```

6. **Deploy**:
```bash
railway up
```

### Option 2: Deploy to Fly.io

1. **Install Fly CLI**: [fly.io/docs/hands-on/install-flyctl](https://fly.io/docs/hands-on/install-flyctl/)

2. **Login and Initialize**:
```bash
fly auth login
fly launch
```

3. **Set Secrets**:
```bash
fly secrets set MONGODB_URI="your-mongodb-uri"
fly secrets set BETTER_AUTH_SECRET="your-secret-key"
fly secrets set BETTER_AUTH_URL="https://your-app.fly.dev"
fly secrets set EXPO_ACCESS_TOKEN="your-expo-token"
```

4. **Deploy**:
```bash
fly deploy
```

### Option 3: Deploy to Render

1. **Create Render Account**: [render.com](https://render.com)

2. **Create New Web Service**:
- Connect your GitHub repository
- Select "Docker" or "Native" runtime
- Set build command: `bun install`
- Set start command: `bun start`

3. **Add Environment Variables** in Render dashboard:
- `MONGODB_URI`
- `BETTER_AUTH_SECRET`
- `BETTER_AUTH_URL`
- `EXPO_ACCESS_TOKEN`
- `PORT` (auto-set by Render)

4. **Deploy**: Render will auto-deploy on git push

### Option 4: Self-Hosted (VPS)

1. **Server Requirements**:
- Ubuntu 20.04+ or similar
- Node.js 18+ or Bun runtime
- MongoDB (local or Atlas)
- Nginx (for reverse proxy)

2. **Install Bun**:
```bash
curl -fsSL https://bun.sh/install | bash
```

3. **Clone and Setup**:
```bash
git clone your-repo
cd backend
bun install
```

4. **Configure Environment**:
```bash
cp .env.example .env
# Edit .env with your values
nano .env
```

5. **Setup PM2 for Process Management**:
```bash
npm install -g pm2
pm2 start src/index.ts --name loan-tracker-api --interpreter bun
pm2 save
pm2 startup
```

6. **Setup Nginx Reverse Proxy**:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

7. **SSL with Certbot**:
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

## 🗄️ MongoDB Setup

### MongoDB Atlas (Cloud - Recommended)

1. **Create Account**: [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)

2. **Create Cluster**:
- Choose FREE tier (M0)
- Select region closest to your users
- Cluster name: `loan-tracker`

3. **Create Database User**:
- Database Access → Add New Database User
- Username: `loan-tracker-user`
- Password: (generate strong password)
- Privileges: Read and write to any database

4. **Network Access**:
- Add IP: `0.0.0.0/0` (for development)
- In production, whitelist only your server IP

5. **Get Connection String**:
- Connect → Connect your application
- Copy connection string
- Replace `<password>` with your password

### Local MongoDB

```bash
# Install MongoDB
sudo apt install mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod

# Connection string
mongodb://localhost:27017/loan-tracker
```

## 🔐 Security Checklist

- [ ] Change `BETTER_AUTH_SECRET` to a strong random string (min 32 chars)
- [ ] Use HTTPS in production (set `BETTER_AUTH_URL` to https://)
- [ ] Whitelist MongoDB IP addresses
- [ ] Enable MongoDB authentication
- [ ] Set `NODE_ENV=production`
- [ ] Configure CORS to specific origins (not `*`)
- [ ] Enable rate limiting (add middleware)
- [ ] Set up monitoring and logging
- [ ] Regular database backups
- [ ] Keep dependencies updated

## 📊 Monitoring

### Health Check Endpoint
```bash
curl https://your-api.com/health
```

### Database Connection
```bash
curl https://your-api.com/api/health
```

### Logs
```bash
# PM2 logs
pm2 logs loan-tracker-api

# Railway logs
railway logs

# Fly.io logs
fly logs
```

## 🔄 Updates and Maintenance

### Update Application
```bash
git pull origin main
bun install
pm2 restart loan-tracker-api
```

### Database Backups (MongoDB Atlas)
- Automatic backups enabled on free tier
- Manual backup: Clusters → ... → Download Snapshot

### Scaling
- **Horizontal**: Add more server instances
- **Vertical**: Upgrade MongoDB tier
- **Caching**: Add Redis for session storage

## 🆘 Troubleshooting

### Connection Issues
```bash
# Test MongoDB connection
mongosh "your-mongodb-uri"

# Test API
curl https://your-api.com/health
```

### Port Already in Use
```bash
# Find process using port
lsof -i :3000

# Kill process
kill -9 PID
```

### Memory Issues
```bash
# Check memory usage
free -h

# PM2 memory
pm2 list
```

## 📞 Support

- **Issues**: GitHub Issues
- **Documentation**: README.md
- **API Docs**: https://your-api.com/swagger

