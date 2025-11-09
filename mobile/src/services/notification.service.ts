import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { userApi } from './api/userApi';
import { store } from '../store';
import { setDeviceToken } from '../store/slices/userSlice';
import { NOTIFICATION_TYPES } from '../utils/constants';

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

class NotificationService {
  private expoPushToken: string | null = null;

  async requestPermissions(): Promise<boolean> {
    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        return false;
      }

      // Get push token
      const token = await Notifications.getExpoPushTokenAsync({
        projectId: 'your-project-id', // Replace with your Expo project ID
      });

      this.expoPushToken = token.data;
      store.dispatch(setDeviceToken(token.data));

      // Register token with backend
      try {
        await userApi.registerDeviceToken(token.data);
      } catch (error) {
        console.error('Failed to register device token:', error);
      }

      return true;
    } catch (error) {
      console.error('Error requesting notification permissions:', error);
      return false;
    }
  }

  async setupNotificationListeners(navigation: any) {
    // Handle notification received while app is in foreground
    Notifications.addNotificationReceivedListener((notification) => {
      console.log('Notification received:', notification);
      // You can update Redux state or show a custom UI here
    });

    // Handle notification tap
    Notifications.addNotificationResponseReceivedListener((response) => {
      const data = response.notification.request.content.data;
      
      // Navigate based on notification type
      if (data?.loanId) {
        // Navigate to loan detail
        // navigation.navigate('LoanDetail', { loanId: data.loanId });
      }
    });
  }

  async scheduleLocalNotification(
    title: string,
    body: string,
    data?: any,
    trigger?: Notifications.NotificationTriggerInput
  ) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data,
        sound: true,
      },
      trigger: trigger || null,
    });
  }

  async cancelAllNotifications() {
    await Notifications.cancelAllScheduledNotificationsAsync();
  }

  getExpoPushToken(): string | null {
    return this.expoPushToken;
  }
}

export const notificationService = new NotificationService();

