# Smart Loan Tracker - Mobile App

React Native mobile app built with Expo for tracking loans between users.

## Features

- 🔐 Authentication with Better Auth
- 💰 Loan management (create, view, edit, delete)
- 💵 Payment recording and tracking
- 📊 Analytics and insights
- 💬 Real-time messaging
- 🔔 Push notifications
- 📱 Offline support with caching

## Tech Stack

- **Framework:** React Native (Expo SDK 51+)
- **State Management:** Redux Toolkit
- **Navigation:** React Navigation v6
- **UI Library:** React Native Paper
- **Forms:** React Hook Form + Zod
- **HTTP Client:** Axios
- **Storage:** Expo SecureStore + AsyncStorage

## Getting Started

### Prerequisites

- Node.js 18+
- Expo CLI
- iOS Simulator (Mac) or Android Emulator

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```env
EXPO_PUBLIC_API_URL=http://localhost:3000/api
EXPO_PUBLIC_WS_URL=ws://localhost:3000/ws
```

3. Start the development server:
```bash
npm start
```

4. Run on iOS:
```bash
npm run ios
```

5. Run on Android:
```bash
npm run android
```

## Project Structure

```
mobile/
├── src/
│   ├── App.tsx                 # Root component
│   ├── navigation/            # Navigation setup
│   ├── screens/               # Screen components
│   ├── components/            # Reusable components
│   ├── services/              # API and services
│   ├── store/                 # Redux store
│   ├── hooks/                 # Custom hooks
│   ├── utils/                 # Utilities
│   └── types/                 # TypeScript types
├── app.json                   # Expo configuration
├── package.json
└── tsconfig.json
```

## API Integration

The app connects to the Elysia.js backend. Make sure the backend is running on `http://localhost:3000` (or update the API URL in `.env`).

## Building for Production

### iOS
```bash
eas build --platform ios
```

### Android
```bash
eas build --platform android
```

## License

MIT

