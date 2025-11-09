import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { useRoute } from '@react-navigation/native';
import { RouteProp } from '@react-navigation/native';
import { messageApi } from '../../services/api/messageApi';
import { MessagesStackParamList } from '../../navigation/MainNavigator';
import { formatDateTime } from '../../utils/formatters';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Message } from '../../services/api/messageApi';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { theme } from '../../theme';

type ChatScreenRouteProp = RouteProp<MessagesStackParamList, 'Chat'>;

const ChatScreen: React.FC = () => {
  const route = useRoute<ChatScreenRouteProp>();
  const { user } = useSelector((state: RootState) => state.auth);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState('');
  const [sending, setSending] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    loadMessages();
  }, [route.params.loanId]);

  const loadMessages = async () => {
    setLoading(true);
    try {
      const response = await messageApi.getMessages(route.params.loanId);
      if (response.success && response.data) {
        setMessages(response.data);
        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: false });
        }, 100);
      }
    } catch (error) {
      // Handle error
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!messageText.trim() || sending) return;

    setSending(true);
    try {
      const response = await messageApi.sendMessage({
        loanId: route.params.loanId,
        content: messageText.trim(),
      });

      if (response.success && response.data) {
        setMessages([...messages, response.data]);
        setMessageText('');
        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
      }
    } catch (error) {
      // Handle error
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const isOwnMessage = item.senderId === user?.id;
          return (
            <View
              style={[
                styles.messageContainer,
                isOwnMessage ? styles.ownMessage : styles.otherMessage,
              ]}
            >
              {!isOwnMessage && (
                <Text variant="labelSmall" style={styles.senderName}>
                  {item.senderName}
                </Text>
              )}
              <View
                style={[
                  styles.messageBubble,
                  isOwnMessage ? styles.ownBubble : styles.otherBubble,
                ]}
              >
                <Text
                  variant="bodyMedium"
                  style={[
                    styles.messageText,
                    isOwnMessage ? styles.ownText : styles.otherText,
                  ]}
                >
                  {item.content}
                </Text>
                <Text
                  variant="labelSmall"
                  style={[
                    styles.timestamp,
                    isOwnMessage ? styles.ownTimestamp : styles.otherTimestamp,
                  ]}
                >
                  {formatDateTime(item.createdAt)}
                </Text>
              </View>
            </View>
          );
        }}
        contentContainerStyle={styles.messagesList}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text variant="bodyLarge" style={styles.emptyText}>
              No messages yet. Start the conversation!
            </Text>
          </View>
        }
      />

      <View style={styles.inputContainer}>
        <TextInput
          value={messageText}
          onChangeText={setMessageText}
          placeholder="Type a message..."
          mode="outlined"
          multiline
          style={styles.input}
          right={
            <TextInput.Icon
              icon="send"
              onPress={sendMessage}
              disabled={!messageText.trim() || sending}
            />
          }
        />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  messagesList: {
    padding: 16,
  },
  messageContainer: {
    marginBottom: 12,
    maxWidth: '80%',
  },
  ownMessage: {
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
  },
  otherMessage: {
    alignSelf: 'flex-start',
    alignItems: 'flex-start',
  },
  senderName: {
    color: theme.colors.placeholder,
    marginBottom: 4,
    marginLeft: 12,
  },
  messageBubble: {
    padding: 12,
    borderRadius: 16,
  },
  ownBubble: {
    backgroundColor: theme.colors.primary,
  },
  otherBubble: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.placeholder + '30',
  },
  messageText: {
    marginBottom: 4,
  },
  ownText: {
    color: '#ffffff',
  },
  otherText: {
    color: theme.colors.text,
  },
  timestamp: {
    fontSize: 10,
  },
  ownTimestamp: {
    color: '#ffffff' + 'CC',
  },
  otherTimestamp: {
    color: theme.colors.placeholder,
  },
  inputContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: theme.colors.placeholder + '30',
    backgroundColor: theme.colors.surface,
  },
  input: {
    backgroundColor: theme.colors.surface,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyText: {
    color: theme.colors.placeholder,
    textAlign: 'center',
  },
});

export default ChatScreen;

