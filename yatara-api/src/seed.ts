import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User';
import Package from './models/Package';
import Vehicle from './models/Vehicle';
import Booking from './models/Booking';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/yatara-ceylon';

const demoUsers = [
  // ── Admins & Staff ────────────────────────────────
  {
    name: 'Yatara Admin',
    email: 'admin@yatara.com',
    role: 'ADMIN',
    status: 'ACTIVE',
    phone: '+94701234567',
  },
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
    role: 'USER', // Using USER for production compatibility
    status: 'ACTIVE',
    phone: '+44791234567',
  },
  // ── Drivers ───────────────────────────────────────
  {
    name: 'Kumara Driver',
    email: 'driver@yatara.com',
    role: 'DRIVER',
    status: 'ACTIVE',
    phone: '+94703456789',
  },
  {
    name: 'Nimal Driver',
    email: 'driver.pending@yatara.com',
    role: 'DRIVER',
    status: 'PENDING_APPROVAL',
    phone: '+94704567890',
  },
  // ── Hotel Managers ────────────────────────────────
  {
    name: 'Priya Hotel',
    email: 'hotel@yatara.com',
    role: 'HOTEL_MANAGER',
    status: 'ACTIVE',
    phone: '+94705678901',
  },
  {
    name: 'Roshan Hotel',
    email: 'hotel.pending@yatara.com',
    role: 'HOTEL_MANAGER',
    status: 'PENDING_APPROVAL',
    phone: '+94706789012',
  },
];

const demoPackages = [
  {
    title: 'Highland Escape: Tea Trails of Nuwara Eliya',
    description: 'Experience the colonial charm and misty mountains of the central highlands.',
    priceMin: 145000,
    durationDays: 4,
    heroImage: 'https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&q=80',
    status: 'published',
    slug: 'highland-escape-nuwara-eliya',
  },
  {
    title: 'Coastal Luxury: Southern Beach Retreat',
    description: 'Relax in the most exclusive villas along the pristine southern coast.',
    priceMin: 220000,
    durationDays: 7,
    heroImage: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&q=80',
    status: 'published',
    slug: 'coastal-luxury-southern-beach',
  }
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB for seeding...');

    // Users
    for (const u of demoUsers) {
      await User.findOneAndUpdate(
        { email: u.email },
        { ...u, password: 'login123' },
        { upsert: true, new: true }
      );
      console.log(`  [OK] ${u.role.padEnd(14)} | ${u.status.padEnd(20)} | ${u.email}`);
    }

    // Packages
    for (const p of demoPackages) {
      await Package.findOneAndUpdate({ title: p.title }, p, { upsert: true });
    }

    console.log('\nAll accounts use password: login123');
    console.log('\nQuick Reference:');
    console.log('  Admin         → admin@yatara.com');
    console.log('  Staff         → staff@yatara.com');
    console.log('  Tourist       → tourist@yatara.com');
    console.log('  Driver (v)    → driver@yatara.com');
    console.log('  Hotel (v)     → hotel@yatara.com');
    
    console.log('\nSeed complete!');
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
}

seed();
