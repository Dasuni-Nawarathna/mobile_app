/**
 * Yatara Ceylon — Demo Account Seed Script
 * ─────────────────────────────────────────
 * Run: npx ts-node src/seed.ts
 *
 * Seeds demo accounts for all roles so the full system can be tested end-to-end.
 * Safe to re-run: uses upsert by email so no duplicate accounts are created.
 */

import dotenv from 'dotenv';
import path from 'path';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Load env vars from project root (both .env.local and .env)
dotenv.config({ path: path.resolve(__dirname, '../../.env.local') });
dotenv.config();

import connectDB from './config/db';
import User from './models/User';

const DEMO_PASSWORD = 'login123';

const demoAccounts = [
  // ── Admin ─────────────────────────────────────────
  {
    name: 'Yatara Admin',
    email: 'admin@yatara.com',
    role: 'ADMIN',
    status: 'ACTIVE',
    phone: '+94701234567',
  },
  // ── Staff ─────────────────────────────────────────
  {
    name: 'Saman Staff',
    email: 'staff@yatara.com',
    role: 'STAFF',
    status: 'ACTIVE',
    phone: '+94702345678',
  },
  // ── Tourists ──────────────────────────────────────
  {
    name: 'Emma Tourist',
    email: 'tourist@yatara.com',
    role: 'USER',
    status: 'ACTIVE',
    phone: '+44791234567',
  },
  {
    name: 'James Walker',
    email: 'james@example.com',
    role: 'TOURIST',
    status: 'ACTIVE',
    phone: '+1234567890',
  },
  // ── Drivers ───────────────────────────────────────
  {
    name: 'Kumara Driver (Verified)',
    email: 'driver.verified@yatara.com',
    role: 'DRIVER',
    status: 'ACTIVE',
    phone: '+94703456789',
  },
  {
    name: 'Nimal Driver (Pending)',
    email: 'driver.pending@yatara.com',
    role: 'DRIVER',
    status: 'PENDING_APPROVAL',
    phone: '+94704567890',
  },
  // ── Hotel Managers ────────────────────────────────
  {
    name: 'Priya Hotel Manager (Verified)',
    email: 'hotel.verified@yatara.com',
    role: 'HOTEL_MANAGER',
    status: 'ACTIVE',
    phone: '+94705678901',
  },
  {
    name: 'Roshan Hotel Manager (Pending)',
    email: 'hotel.pending@yatara.com',
    role: 'HOTEL_MANAGER',
    status: 'PENDING_APPROVAL',
    phone: '+94706789012',
  },
];

async function seed() {
  try {
    await connectDB();
    console.log('\nYatara Ceylon — Cleaning existing demo accounts...\n');
    const demoEmails = demoAccounts.map(a => a.email.toLowerCase());
    await User.deleteMany({ email: { $in: demoEmails } });
    
    console.log('Seeding demo accounts...\n');

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(DEMO_PASSWORD, salt);

    for (const account of demoAccounts) {
      const result = await User.findOneAndUpdate(
        { email: account.email },
        {
          $set: {
            name: account.name,
            email: account.email,
            passwordHash,
            role: account.role.trim(),
            status: account.status,
            phone: account.phone,
            emailVerified: true,
            isDeleted: false,
            failedLoginAttempts: 0,
            lockedUntil: undefined,
          },
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      console.log(`  [OK] ${account.role.padEnd(15)} | ${account.status.padEnd(20)} | ${account.email}`);
    }

    console.log(`\nAll accounts use password: ${DEMO_PASSWORD}`);
    console.log('\nQuick Reference:');
    console.log('  Admin         → admin@yatara.com');
    console.log('  Staff         → staff@yatara.com');
    console.log('  Tourist       → tourist@yatara.com');
    console.log('  Driver (v)   → driver.verified@yatara.com');
    console.log('  Driver (p)   → driver.pending@yatara.com');
    console.log('  Hotel (v)    → hotel.verified@yatara.com');
    console.log('  Hotel (p)    → hotel.pending@yatara.com');
    console.log('\nSeed complete!\n');

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Seed failed:', err);
    process.exit(1);
  }
}

seed();
