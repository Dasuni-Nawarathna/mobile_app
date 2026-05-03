import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { ENV } from './config/environment';
import { connectDB } from './config/database';
import { findFirstAvailablePort } from './utils/findFreePort';
import authRoutes from './routes/authRoutes';
import packageRoutes from './routes/packageRoutes';
import bookingRoutes from './routes/bookingRoutes';
import vehicleRoutes from './routes/vehicleRoutes';
import paymentRoutes from './routes/paymentRoutes';
import invoiceRoutes from './routes/invoiceRoutes';
import partnerRoutes from './routes/partnerRoutes';
import userNotificationRoutes from './routes/userNotificationRoutes';

const app: Application = express();

// ═══════════════════════════════════════════════════════════
// MIDDLEWARE
// ═══════════════════════════════════════════════════════════

// CORS — browsers send http(s) Origin; Expo Web uses http://localhost:8081 (not exp://).
const staticAllowedOrigins = new Set<string>([
  ENV.FRONTEND_URL,
  ENV.MOBILE_APP_URL,
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:5000',
  'http://127.0.0.1:5000',
  'exp://localhost:8081',
  'http://localhost:8081',
  'http://127.0.0.1:8081',
  'http://localhost:8082',
  'http://127.0.0.1:8082',
  'http://localhost:19006',
  'http://127.0.0.1:19006',
]);

const devLocalOrigin =
  /^https?:\/\/(localhost|127\.0\.0\.1|\[::1\])(:\d+)?$/i;

function corsOrigin(
  origin: string | undefined,
  cb: (err: Error | null, allow?: boolean) => void
) {
  if (!origin) {
    cb(null, true);
    return;
  }
  if (staticAllowedOrigins.has(origin)) {
    cb(null, true);
    return;
  }
  if (ENV.NODE_ENV !== 'production' && devLocalOrigin.test(origin)) {
    cb(null, true);
    return;
  }
  console.warn('[CORS] Blocked Origin:', origin);
  cb(new Error('Not allowed by CORS'));
}

app.use(
  cors({
    origin: corsOrigin,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Body Parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// ═══════════════════════════════════════════════════════════
// ROUTES
// ═══════════════════════════════════════════════════════════

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    message: 'Yatara Ceylon Backend is running',
    timestamp: new Date().toISOString(),
  });
});

// Authentication routes (public)
app.use('/api/auth', authRoutes);

// Core Entity CRUD Routes
// Module 1: Account Management & Notifications (Member 1)
app.use('/api', userNotificationRoutes);

// Module 2: Product & Content Management (Member 2)
app.use('/api/packages', packageRoutes);

// Module 3: Vehicle Fleet Management (Member 3)
app.use('/api/vehicles', vehicleRoutes);

// Module 4: Booking & Reservation Management (Member 4)
app.use('/api/bookings', bookingRoutes);

// Module 5: Finance Management (Member 5)
app.use('/api/payments', paymentRoutes);
app.use('/api/invoices', invoiceRoutes);

// Module 6: Supplier/Partner Management (Member 6)
app.use('/api/partners', partnerRoutes);

// ═══════════════════════════════════════════════════════════
// ERROR HANDLING
// ═══════════════════════════════════════════════════════════

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('❌ Error:', err);
  
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  res.status(statusCode).json({
    error: {
      status: statusCode,
      message,
      ...(ENV.NODE_ENV === 'development' && { stack: err.stack }),
    },
  });
});

// 404 Handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: {
      status: 404,
      message: 'Route not found',
      path: req.path,
    },
  });
});

// ═══════════════════════════════════════════════════════════
// SERVER START
// ═══════════════════════════════════════════════════════════

async function startServer() {
  try {
    await connectDB();

    const preferred = Number(ENV.PORT) || 5000;
    /** In production, bind exactly `PORT`; in dev auto-pick next free slot if preferred is busy. */
    const strictBind =
      ENV.NODE_ENV === 'production' || process.env.PORT_FALLBACK === 'false';
    const PORT = strictBind ? preferred : await findFirstAvailablePort(preferred);

    if (!strictBind && PORT !== preferred) {
      console.warn('');
      console.warn(
        `   ℹ️  Using port ${PORT} (configured ${preferred} was in use). Mobile app defaults expect ${preferred}: set EXPO_PUBLIC_API_URL=http://localhost:${PORT} — or stop the old process holding ${preferred}.`
      );
      console.warn('');
    }

    app.listen(PORT, () => {
      console.log('');
      console.log('╔════════════════════════════════════════╗');
      console.log(`║  🚀 Yatara Ceylon Backend Started      ║`);
      console.log(`║  Port: ${PORT}${' '.repeat(Math.max(0, 34 - String(PORT).length))}║`);
      console.log(`║  Env: ${ENV.NODE_ENV}${' '.repeat(Math.max(0, 33 - String(ENV.NODE_ENV).length))}║`);
      console.log('╚════════════════════════════════════════╝');
      console.log('');
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Only start if running directly
if (require.main === module) {
  startServer();
}

export default app;
