import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { setNotifications, markAsRead } from '../store/slices/notificationSlice';
import { notificationApi } from '../services/api/notificationApi';

export const useNotifications = () => {
  const dispatch = useDispatch<AppDispatch>();
  const notifications = useSelector((state: RootState) => state.notifications);

  const loadNotifications = async () => {
    try {
      const response = await notificationApi.getNotifications(50);
      if (response.success && response.data) {
        dispatch(setNotifications(response.data));
        return response.data;
      }
      return [];
    } catch (error) {
      console.error('Error loading notifications:', error);
      return [];
    }
  };

  const markNotificationAsRead = async (notificationId: string) => {
    dispatch(markAsRead(notificationId));
    try {
      await notificationApi.markAsRead(notificationId);
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  return {
    ...notifications,
    loadNotifications,
    markNotificationAsRead,
  };
};

