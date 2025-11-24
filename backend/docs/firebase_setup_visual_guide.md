# Firebase Setup - Visual Step-by-Step Guide (2024/2025)

## ⚠️ IMPORTANT: You're Not in the Firebase Console Yet!

The screen you showed me is **NOT** the Firebase Console. You need to go to the actual Firebase website first.

## Step 0: Go to Firebase Console

**Open your web browser and go to:**

👉 **https://console.firebase.google.com/**

Or alternatively:
1. Go to https://firebase.google.com/
2. Click **"Go to console"** in the top right corner

You'll need to sign in with your Google account.

---

## Step 1: Create or Select a Project

### If you DON'T have a project yet:
1. Click **"+ New Workspace"** or look for **"Add project"** button
2. Enter a project name (e.g., `smart-loan-tracker`)
3. Click **"Continue"**
4. Disable Google Analytics (optional, you can enable it later)
5. Click **"Create project"**
6. Wait for the project to be created (~30 seconds)

### If you ALREADY have a project:
1. Click on your project name from the list
2. You'll be taken to the Project Overview page

---

## Step 2: Navigate to Project Settings

Once you're in your project:

1. Look for the **⚙️ gear icon** next to "Project Overview" in the left sidebar
2. Click the gear icon
3. Select **"Project settings"** from the dropdown menu

---

## Step 3: Go to Service Accounts Tab

In the Project Settings page:

1. You'll see several tabs at the top: **General**, **Service accounts**, **Cloud Messaging**, etc.
2. Click on the **"Service accounts"** tab

---

## Step 4: Generate Private Key

In the Service accounts tab:

1. You'll see a section titled **"Firebase Admin SDK"**
2. Below it, you'll see a button that says **"Generate new private key"**
3. Click **"Generate new private key"**
4. A warning dialog will appear saying: *"This key grants full access to your Firebase project. Keep it confidential and never store it in a public repository."*
5. Click **"Generate key"** to confirm

---

## Step 5: Download the JSON File

1. A JSON file will automatically download to your computer
2. The file will be named something like: `smart-loan-tracker-firebase-adminsdk-xxxxx-xxxxxxxxxx.json`
3. **IMPORTANT**: Move this file to a secure location (NOT in your project folder if it's a git repo)

---

## Step 6: Configure Your Backend

Now that you have the JSON file, you need to add it to your backend:

### Option A: Use the Full JSON (Recommended)

1. Open the downloaded JSON file in a text editor
2. Copy the **entire contents** of the file
3. Create a `.env` file in your `backend/` directory:

```bash
cd /media/ego/New\ Volume1/Egos/Projects/Personal/0/DEV/smart-loan-tracker/backend
touch .env
```

4. Open `.env` and add:

```bash
NODE_ENV=development
PORT=3000
CORS_ORIGIN=*

# Paste the entire JSON content as a single line string
FIREBASE_SERVICE_ACCOUNT='{"type":"service_account","project_id":"your-project-id",...}'
```

### Option B: Use Individual Fields

Alternatively, extract these fields from the JSON:

```bash
NODE_ENV=development
PORT=3000
CORS_ORIGIN=*

FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"
```

---

## Step 7: Restart Your Server

1. Stop the running server (press `Ctrl+C` in the terminal)
2. Start it again:

```bash
bun run dev
```

3. You should see: **"Firebase Admin initialized successfully"**

---

## Troubleshooting

### "I don't see the Service Accounts tab"
- Make sure you're in **Project Settings** (gear icon → Project settings)
- The tab should be visible at the top of the page

### "I can't generate a private key"
- You might have organization policies blocking this
- Try going to Google Cloud Console → IAM & Admin → Organization Policies
- Find "Disable service account key creation" and set it to "OFF"

### "The server still shows 'demo-project'"
- Make sure your `.env` file is in the correct location: `backend/.env`
- Check that the JSON is valid (no extra quotes or line breaks)
- Restart the server completely

---

## Next Steps

Once Firebase is connected:

1. **Enable Authentication**:
   - Go to Build → Authentication
   - Click "Get started"
   - Enable Email/Password or other providers

2. **Enable Firestore**:
   - Go to Build → Firestore Database
   - Click "Create database"
   - Choose "Start in production mode"
   - Select a location

3. **Test the API**:
   - Use the `.rest` files in `backend/.rest/`
   - You'll need a Firebase ID token to test authenticated endpoints

---

## Security Reminder

⚠️ **NEVER commit the following to Git:**
- `.env` file
- `*firebase-adminsdk*.json` files
- Any file containing your private key

These are already added to `.gitignore`, but double-check before committing!
