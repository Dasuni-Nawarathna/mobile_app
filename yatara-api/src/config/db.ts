import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

// In production (Railway), env vars are injected directly — no file needed.
// Locally, load from the project root .env.local (one level up from yatara-api/).
dotenv.config({ path: path.resolve(__dirname, '../../.env.local') });
dotenv.config(); // Also try local .env as fallback

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${(error as Error).message}`);
    process.exit(1);
  }
};

export default connectDB;
