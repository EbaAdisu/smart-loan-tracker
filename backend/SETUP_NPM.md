# 🚀 Quick Setup Guide (NPM)

## ✅ Packages Installed Successfully!

Your backend is ready to configure and run.

---

## 📋 Next Steps

### 1. Create Environment File
```bash
cp env.example .env
```

### 2. Configure Environment Variables

Edit `.env` file with your values:

```env
# MongoDB Connection (REQUIRED)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/loan-tracker

# Better Auth Secret (REQUIRED)
# Generate with: openssl rand -base64 32
BETTER_AUTH_SECRET=your-32-character-or-longer-secret-here

# Server URL
BETTER_AUTH_URL=http://localhost:3000

# Expo Push (Optional - add later)
EXPO_ACCESS_TOKEN=

# CORS (for mobile dev)
CORS_ORIGIN=http://localhost:8081,exp://localhost:8081
```

---

## 🗄️ Setup MongoDB (FREE)

### Option 1: MongoDB Atlas (Recommended - Cloud)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a new cluster (M0 FREE tier)
4. Create a database user:
   - Username: `loan-tracker-user`
   - Password: (generate a strong password)
5. Network Access: Add IP `0.0.0.0/0` (for development)
6. Get connection string:
   - Click "Connect" → "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your password
   - Replace `myFirstDatabase` with `loan-tracker`

**Example:**
```
mongodb+srv://loan-tracker-user:mypassword123@cluster0.abc123.mongodb.net/loan-tracker?retryWrites=true&w=majority
```

### Option 2: Local MongoDB

```bash
# Install MongoDB (Ubuntu/Debian)
sudo apt-get install mongodb

# Start MongoDB
sudo systemctl start mongodb

# Use local connection string
MONGODB_URI=mongodb://localhost:27017/loan-tracker
```

---

## 🔐 Generate Better Auth Secret

```bash
# Generate a secure 32+ character secret
openssl rand -base64 32
```

Copy the output and paste it in `.env` as `BETTER_AUTH_SECRET`.

---

## ▶️ Start the Server

```bash
# Development mode (with hot reload)
npm run dev
```

You should see:
```
✅ MongoDB connected successfully
✅ All cron jobs started
🚀 Smart Loan Tracker Backend Started!

Server:     http://localhost:3000
Swagger:    http://localhost:3000/swagger
WebSocket:  ws://localhost:3000/ws
```

---

## 🧪 Test the API

### Open Swagger UI
Visit: http://localhost:3000/swagger

### Test Health Endpoint
```bash
curl http://localhost:3000/health
```

### Create Test Account
```bash
curl -X POST http://localhost:3000/api/auth/sign-up/email \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePass123!",
    "name": "Test User"
  }'
```

---

## 🔧 Available Commands

```bash
# Development (hot reload)
npm run dev

# Production
npm start

# Build for production
npm run build

# Type checking
npx tsc --noEmit
```

---

## 📚 Documentation

- **Full Setup Guide**: `docs/GETTING_STARTED.md`
- **API Reference**: `docs/API_DOCUMENTATION.md`
- **Deployment Guide**: `docs/DEPLOYMENT.md`
- **All Docs**: `docs/README.md`

---

## 🆘 Troubleshooting

### MongoDB Connection Error
- ✅ Check your connection string in `.env`
- ✅ Verify IP whitelist in MongoDB Atlas
- ✅ Ensure database user credentials are correct

### Port 3000 Already in Use
```bash
# Find process using port 3000
lsof -i :3000

# Kill process
kill -9 PID
```

### Better Auth Errors
- ✅ Ensure `BETTER_AUTH_SECRET` is at least 32 characters
- ✅ Check `BETTER_AUTH_URL` is correct
- ✅ Verify MongoDB is connected

### Module Not Found
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

---

## ✨ What You Have

✅ **All packages installed** (109 packages)  
✅ **24 API endpoints** ready  
✅ **5 database models** created  
✅ **Real-time WebSocket** configured  
✅ **Push notifications** setup  
✅ **Cron jobs** ready  
✅ **Swagger documentation** included  

---

## 🎯 Quick Checklist

- [ ] Copy `env.example` to `.env`
- [ ] Setup MongoDB Atlas account (or local MongoDB)
- [ ] Add MongoDB URI to `.env`
- [ ] Generate and add Better Auth secret to `.env`
- [ ] Run `npm run dev`
- [ ] Visit http://localhost:3000/swagger
- [ ] Create test account
- [ ] Test API endpoints

---

## 🎉 You're Ready!

Once you complete the setup above, your backend will be fully operational!

**Next Step:** Configure your `.env` file and run `npm run dev`

**Need help?** Check `docs/GETTING_STARTED.md` for detailed instructions.

---

**Happy coding! 🚀**

