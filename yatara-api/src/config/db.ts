import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load from parent directory .env.local
dotenv.config({ path: '../.env.local' });

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI as string);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${(error as Error).message}`);
    process.exit(1);
  }
};

export default connectDB;
