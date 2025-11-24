# Firebase Setup Guide

This guide will help you set up Firebase for the Smart Loan Tracker backend.

## Why You Need Firebase Credentials

The backend currently runs in **development mode** with a fallback configuration (`demo-project`). This means:
- ✅ The server starts without errors
- ❌ No real data is stored (Firestore won't work)
- ❌ Authentication won't work
- ❌ Push notifications won't work

To use the backend properly, you need to configure Firebase credentials.

---

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** or select an existing project
3. Enter a project name (e.g., `smart-loan-tracker`)
4. Follow the setup wizard (you can disable Google Analytics if you don't need it)
5. Click **"Create project"**

---

## Step 2: Enable Firebase Services

### 2.1 Enable Authentication
1. In the Firebase Console, go to **Build** → **Authentication**
2. Click **"Get started"**
3. Enable the sign-in methods you want to use (e.g., Email/Password, Google, etc.)

### 2.2 Enable Firestore Database
1. Go to **Build** → **Firestore Database**
2. Click **"Create database"**
3. Choose **"Start in production mode"** (we'll set up rules later)
4. Select a location (choose one closest to your users)
5. Click **"Enable"**

### 2.3 Enable Cloud Messaging (for Push Notifications)
1. Go to **Build** → **Cloud Messaging**
2. Click **"Get started"** (if prompted)
3. No additional setup needed here for the backend

---

## Step 3: Generate Service Account Credentials

1. In the Firebase Console, click the **⚙️ gear icon** → **Project settings**
2. Go to the **"Service accounts"** tab
3. Click **"Generate new private key"**
4. Click **"Generate key"** in the confirmation dialog
5. A JSON file will be downloaded (e.g., `smart-loan-tracker-firebase-adminsdk-xxxxx.json`)

⚠️ **IMPORTANT**: Keep this file secure! It contains sensitive credentials.

---

## Step 4: Configure Environment Variables

You have **two options** for providing credentials:

### Option 1: Using the Service Account JSON (Recommended)

1. Open the downloaded JSON file
2. Copy the **entire contents** of the file
3. Create a `.env` file in the `backend/` directory:

```bash
# backend/.env
NODE_ENV=development
PORT=3000
CORS_ORIGIN=*

# Firebase - Option 1: Service Account JSON (as a single string)
FIREBASE_SERVICE_ACCOUNT='{"type":"service_account","project_id":"your-project-id","private_key_id":"...","private_key":"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n","client_email":"...","client_id":"...","auth_uri":"...","token_uri":"...","auth_provider_x509_cert_url":"...","client_x509_cert_url":"..."}'
```

### Option 2: Using Individual Fields

Alternatively, you can extract specific fields from the JSON:

```bash
# backend/.env
NODE_ENV=development
PORT=3000
CORS_ORIGIN=*

# Firebase - Option 2: Individual fields
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"
```

⚠️ **Note**: For `FIREBASE_PRIVATE_KEY`, make sure to keep the `\n` characters for line breaks.

---

## Step 5: Update `.gitignore`

Make sure your `.env` file is **NOT** committed to Git:

```bash
# backend/.gitignore
.env
*.json  # This will ignore the service account JSON file
```

---

## Step 6: Restart the Server

1. Stop the running server (Ctrl+C)
2. Start it again:

```bash
cd backend
bun run dev
```

3. You should see: `Firebase Admin initialized successfully`

---

## Step 7: Test the Setup

### 7.1 Create a Test User in Firebase
1. Go to **Build** → **Authentication** → **Users**
2. Click **"Add user"**
3. Enter an email and password
4. Click **"Add user"**

### 7.2 Get a Firebase ID Token

You can use the Firebase Auth REST API or a frontend app to get an ID token. For quick testing:

1. Install Firebase CLI: `npm install -g firebase-tools`
2. Run: `firebase login`
3. Use the Firebase Auth Emulator or a frontend app to sign in and get the token

### 7.3 Test the API

Use the `.rest` files in `backend/.rest/` to test:

```http
GET http://localhost:3000/api/users/me
Authorization: Bearer YOUR_FIREBASE_ID_TOKEN
```

---

## Troubleshooting

### Error: "Failed to initialize Firebase Admin"
- Check that your `.env` file is in the correct location (`backend/.env`)
- Verify the JSON is valid (no extra quotes or formatting issues)
- Make sure the service account has the correct permissions

### Error: "Unauthorized" when testing endpoints
- Verify the Firebase ID token is valid and not expired
- Check that the user exists in Firebase Authentication
- Ensure the token is sent in the `Authorization: Bearer <token>` header

### Firestore Permission Denied
- Go to **Firestore Database** → **Rules**
- Update the rules to allow authenticated users:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

---

## Production Deployment

For production, use environment variables from your hosting provider (e.g., Vercel, Railway, Render):

1. Add the environment variables in your hosting dashboard
2. Use `FIREBASE_SERVICE_ACCOUNT` with the full JSON string
3. Set `NODE_ENV=production`
4. Set `CORS_ORIGIN` to your frontend URL

---

## Summary

✅ Created Firebase project  
✅ Enabled Authentication, Firestore, and Cloud Messaging  
✅ Generated service account credentials  
✅ Configured `.env` file  
✅ Tested the API with a real Firebase ID token  

Your backend is now fully connected to Firebase! 🎉
