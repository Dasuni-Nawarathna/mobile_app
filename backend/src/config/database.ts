import mongoose from 'mongoose';
import { ENV } from './environment';

let isConnected = false;

export async function connectDB() {
  if (isConnected) {
    console.log('📦 Using existing database connection');
    return;
  }

  try {
    console.log('🔌 Connecting to MongoDB...');
    
    await mongoose.connect(ENV.MONGODB_URI as string, {
      maxPoolSize: 10,
      minPoolSize: 2,
      socketTimeoutMS: 45000,
    });

    isConnected = true;
    console.log('✅ MongoDB connected successfully');
    
    return mongoose.connection;
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    process.exit(1);
  }
}

export async function disconnectDB() {
  if (isConnected) {
    await mongoose.disconnect();
    isConnected = false;
    console.log('🔌 MongoDB disconnected');
  }
}

export function getDB() {
  return mongoose.connection;
}
