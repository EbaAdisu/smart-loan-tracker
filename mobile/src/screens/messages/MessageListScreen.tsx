import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, TouchableOpacity } from 'react-native';
import { Card, Text, Badge } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { messageApi } from '../../services/api/messageApi';
import { MessagesStackParamList } from '../../navigation/MainNavigator';
import { formatRelativeTime } from '../../utils/formatters';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { theme } from '../../theme';

type MessageListScreenNavigationProp = StackNavigationProp<MessagesStackParamList, 'MessageList'>;

interface MessageThread {
  loanId: string;
  loanName: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
}

const MessageListScreen: React.FC = () => {
  const navigation = useNavigation<MessageListScreenNavigationProp>();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [threads, setThreads] = useState<MessageThread[]>([]);

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    setLoading(true);
    try {
      const response = await messageApi.getRecentMessages(50);
      if (response.success && response.data) {
        // Group messages by loanId
        const grouped: { [key: string]: any } = {};
        response.data.forEach((msg: any) => {
          if (!grouped[msg.loanId]) {
            grouped[msg.loanId] = {
              loanId: msg.loanId,
              loanName: `Loan ${msg.loanId.slice(0, 8)}`,
              lastMessage: msg.content,
              timestamp: msg.createdAt,
              unreadCount: msg.read ? 0 : 1,
            };
          } else {
            if (new Date(msg.createdAt) > new Date(grouped[msg.loanId].timestamp)) {
              grouped[msg.loanId].lastMessage = msg.content;
              grouped[msg.loanId].timestamp = msg.createdAt;
            }
            if (!msg.read) {
              grouped[msg.loanId].unreadCount += 1;
            }
          }
        });
        setThreads(Object.values(grouped));
      }
    } catch (error) {
      // Handle error
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadMessages();
    setRefreshing(false);
  };

  if (loading && threads.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={threads}
        keyExtractor={(item) => item.loanId}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate('Chat', { loanId: item.loanId })}
          >
            <Card style={styles.card}>
              <Card.Content>
                <View style={styles.messageHeader}>
                  <View style={styles.messageInfo}>
                    <Text variant="titleMedium" style={styles.loanName}>
                      {item.loanName}
                    </Text>
                    <Text variant="bodySmall" style={styles.timestamp}>
                      {formatRelativeTime(item.timestamp)}
                    </Text>
                  </View>
                  {item.unreadCount > 0 && (
                    <Badge style={styles.badge}>{item.unreadCount}</Badge>
                  )}
                </View>
                <Text variant="bodyMedium" style={styles.lastMessage} numberOfLines={2}>
                  {item.lastMessage}
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
              No messages yet
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
  list: {
    paddingBottom: 16,
  },
  card: {
    marginVertical: 8,
    marginHorizontal: 16,
    elevation: 2,
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  messageInfo: {
    flex: 1,
  },
  loanName: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  timestamp: {
    color: theme.colors.placeholder,
  },
  badge: {
    backgroundColor: theme.colors.primary,
  },
  lastMessage: {
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

export default MessageListScreen;

