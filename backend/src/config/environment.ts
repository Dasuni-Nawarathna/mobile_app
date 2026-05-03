import dotenv from 'dotenv';

dotenv.config();

export const ENV = {
  // Server
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // Database
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/yatara-ceylon',
  
  // JWT
  JWT_SECRET: process.env.JWT_SECRET || 'dev-secret-key-change-in-production',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  
  // CORS & API
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
  MOBILE_APP_URL: process.env.MOBILE_APP_URL || 'exp://localhost:8081',
  
  // Email
  EMAIL_USER: process.env.EMAIL_USER || '',
  EMAIL_PASSWORD: process.env.EMAIL_PASSWORD || '',
  
  // Stripe
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || '',
};

// Validate critical variables
if (!ENV.MONGODB_URI) {
  console.warn('⚠️ MONGODB_URI not configured');
}

if (!ENV.JWT_SECRET || ENV.JWT_SECRET === 'dev-secret-key-change-in-production') {
  console.warn('⚠️ JWT_SECRET using default - set in .env for production!');
}
