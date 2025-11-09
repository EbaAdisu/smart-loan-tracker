import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, TouchableOpacity } from 'react-native';
import { Card, Text, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { notificationApi } from '../../services/api/notificationApi';
import { setNotifications, markAsRead } from '../../store/slices/notificationSlice';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { formatRelativeTime } from '../../utils/formatters';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Notification } from '../../services/api/notificationApi';
import { theme } from '../../theme';

const NotificationsScreen: React.FC = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch<AppDispatch>();
  const { notifications, loading } = useSelector((state: RootState) => state.notifications);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      const response = await notificationApi.getNotifications(50);
      if (response.success && response.data) {
        dispatch(setNotifications(response.data));
      }
    } catch (error) {
      // Handle error
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadNotifications();
    setRefreshing(false);
  };

  const handleNotificationPress = async (notification: Notification) => {
    if (!notification.read) {
      dispatch(markAsRead(notification.id));
      try {
        await notificationApi.markAsRead(notification.id);
      } catch (error) {
        // Handle error
      }
    }

    // Navigate to related loan if available
    if (notification.loanId) {
      // Navigate to loan detail - you'll need to adjust this based on your navigation structure
      // navigation.navigate('LoanDetail', { loanId: notification.loanId });
    }
  };

  const handleMarkAllRead = async () => {
    // Mark all unread notifications as read
    const unreadNotifications = notifications.filter((n) => !n.read);
    for (const notification of unreadNotifications) {
      dispatch(markAsRead(notification.id));
      try {
        await notificationApi.markAsRead(notification.id);
      } catch (error) {
        // Handle error
      }
    }
  };

  if (loading && notifications.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <View style={styles.container}>
      {notifications.some((n) => !n.read) && (
        <View style={styles.header}>
          <Button mode="text" onPress={handleMarkAllRead}>
            Mark All as Read
          </Button>
        </View>
      )}

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleNotificationPress(item)}>
            <Card
              style={[
                styles.card,
                !item.read && styles.unreadCard,
              ]}
            >
              <Card.Content>
                <View style={styles.notificationHeader}>
                  <Text variant="titleMedium" style={styles.title}>
                    {item.title}
                  </Text>
                  {!item.read && <View style={styles.unreadDot} />}
                </View>
                <Text variant="bodyMedium" style={styles.message}>
                  {item.message}
                </Text>
                <Text variant="bodySmall" style={styles.timestamp}>
                  {formatRelativeTime(item.createdAt)}
                </Text>
              </Card.Content>
            </Card>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text variant="bodyLarge" style={styles.emptyText}>
              No notifications
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    padding: 16,
    alignItems: 'flex-end',
  },
  list: {
    paddingBottom: 16,
  },
  card: {
    marginVertical: 8,
    marginHorizontal: 16,
    elevation: 2,
  },
  unreadCard: {
    backgroundColor: theme.colors.primary + '10',
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontWeight: 'bold',
    flex: 1,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.primary,
    marginLeft: 8,
  },
  message: {
    marginBottom: 8,
    color: theme.colors.text,
  },
  timestamp: {
    color: theme.colors.placeholder,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyText: {
    color: theme.colors.placeholder,
  },
});

export default NotificationsScreen;

