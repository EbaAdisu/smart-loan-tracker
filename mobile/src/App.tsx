import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import AppNavigator from './navigation/AppNavigator';
import { StatusBar } from 'expo-status-bar';
import { websocketService } from './services/websocket.service';
import { notificationService } from './services/notification.service';

// Initialize services
notificationService.requestPermissions();

// Listen to store changes for WebSocket connection
let currentUserId: string | null = null;
store.subscribe(() => {
  const state = store.getState();
  const { isAuthenticated, user } = state.auth;
  
  if (isAuthenticated && user?.id && user.id !== currentUserId) {
    currentUserId = user.id;
    websocketService.connect(user.id);
  } else if (!isAuthenticated && currentUserId) {
    currentUserId = null;
    websocketService.disconnect();
  }
});

export default function App() {
  return (
    <Provider store={store}>
      <StatusBar style="auto" />
      <AppNavigator />
    </Provider>
  );
}

