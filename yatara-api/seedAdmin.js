const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGODB_URI = 'mongodb://YataraCeylon:YataraCeylon@ac-nl8fv2p-shard-00-00.ovgs0fc.mongodb.net:27017,ac-nl8fv2p-shard-00-01.ovgs0fc.mongodb.net:27017,ac-nl8fv2p-shard-00-02.ovgs0fc.mongodb.net:27017/?ssl=true&replicaSet=atlas-scwm0i-shard-0&authSource=admin&appName=Cluster0';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['ADMIN', 'STAFF', 'USER', 'VEHICLE_OWNER', 'HOTEL_OWNER'], default: 'USER' },
  status: { type: String, default: 'ACTIVE' },
}, { collection: 'users' });

const User = mongoose.model('User', userSchema);

async function seedAdmin() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB.');

    const adminEmail = 'admin@yataraceylon.com';
    const password = 'AdminPassword123!';

    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log('Admin already exists! You can log in with:');
      console.log(`Email: ${adminEmail}`);
      console.log(`Password: ${password}`);
      process.exit(0);
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newAdmin = new User({
      name: 'Yatara Admin',
      email: adminEmail,
      passwordHash,
      role: 'ADMIN',
      status: 'ACTIVE'
    });

    await newAdmin.save();
    console.log('Admin user created successfully!');
    console.log(`Email: ${adminEmail}`);
    console.log(`Password: ${password}`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin:', error);
    process.exit(1);
  }
}

seedAdmin();
