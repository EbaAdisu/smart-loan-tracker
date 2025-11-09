// WebSocket handler for real-time features
import { Elysia } from 'elysia';
import { authMiddleware } from '../middleware/auth.middleware';
import logger from '../utils/logger';

interface WebSocketMessage {
  type: 'message' | 'notification' | 'status_change' | 'user_status';
  data: any;
  userId?: string;
  loanId?: string;
}

// WebSocket connections store
const connections = new Map<string, any>();

export const websocketHandler = new Elysia()
  .ws('/ws', {
    open(ws) {
      logger.info('WebSocket connection opened');
    },

    message(ws, message: WebSocketMessage) {
      try {
        logger.debug('WebSocket message received', { message });

        // Handle different message types
        switch (message.type) {
          case 'message':
            // Broadcast new message to specific user
            if (message.userId) {
              broadcastToUser(message.userId, {
                type: 'new_message',
                data: message.data,
              });
            }
            break;

          case 'notification':
            // Broadcast notification to specific user
            if (message.userId) {
              broadcastToUser(message.userId, {
                type: 'new_notification',
                data: message.data,
              });
            }
            break;

          case 'status_change':
            // Broadcast loan status change
            if (message.loanId) {
              broadcastToLoan(message.loanId, {
                type: 'loan_status_changed',
                data: message.data,
              });
            }
            break;

          case 'user_status':
            // Broadcast user online/offline status
            if (message.userId) {
              broadcastAll({
                type: 'user_status_changed',
                userId: message.userId,
                data: message.data,
              });
            }
            break;

          default:
            logger.warn('Unknown WebSocket message type', { type: message.type });
        }
      } catch (error) {
        logger.error('Error handling WebSocket message', error);
      }
    },

    close(ws) {
      logger.info('WebSocket connection closed');
      // Remove from connections
      for (const [userId, connection] of connections.entries()) {
        if (connection === ws) {
          connections.delete(userId);
          break;
        }
      }
    },
  });

// Broadcast message to specific user
function broadcastToUser(userId: string, message: any) {
  const connection = connections.get(userId);
  if (connection) {
    connection.send(JSON.stringify(message));
    logger.debug(`Broadcasted to user ${userId}`, { message });
  }
}

// Broadcast message to all users in a loan
function broadcastToLoan(loanId: string, message: any) {
  // In a real implementation, you'd look up all users in the loan
  // and broadcast to each of them
  logger.debug(`Broadcasting to loan ${loanId}`, { message });
}

// Broadcast message to all connected users
function broadcastAll(message: any) {
  for (const connection of connections.values()) {
    connection.send(JSON.stringify(message));
  }
  logger.debug('Broadcasted to all users', { message });
}

// Register a user connection
export function registerConnection(userId: string, ws: any) {
  connections.set(userId, ws);
  logger.success(`Registered WebSocket connection for user ${userId}`);
}

// Unregister a user connection
export function unregisterConnection(userId: string) {
  connections.delete(userId);
  logger.info(`Unregistered WebSocket connection for user ${userId}`);
}

export default websocketHandler;

