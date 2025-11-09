// MongoDB database configuration
import mongoose from 'mongoose';
import { env } from './env';

// Connection options
const options: mongoose.ConnectOptions = {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
};

// Connect to MongoDB
export async function connectDatabase() {
    try {
        console.log('🔄 Connecting to MongoDB...');

        await mongoose.connect(env.MONGODB_URI, options);

        console.log('✅ MongoDB connected successfully');

        // Connection event handlers
        mongoose.connection.on('error', (error) => {
            console.error('❌ MongoDB connection error:', error);
        });

        mongoose.connection.on('disconnected', () => {
            console.warn('⚠️  MongoDB disconnected');
        });

        mongoose.connection.on('reconnected', () => {
            console.log('🔄 MongoDB reconnected');
        });

    } catch (error) {
        console.error('❌ Failed to connect to MongoDB:', error);
        process.exit(1);
    }
}

// Disconnect from MongoDB
export async function disconnectDatabase() {
    try {
        await mongoose.connection.close();
        console.log('MongoDB connection closed');
    } catch (error) {
        console.error('Error closing MongoDB connection:', error);
    }
}

// Get database connection status
export function isDatabaseConnected(): boolean {
    return mongoose.connection.readyState === 1;
}

export default {
    connect: connectDatabase,
    disconnect: disconnectDatabase,
    isConnected: isDatabaseConnected,
};

