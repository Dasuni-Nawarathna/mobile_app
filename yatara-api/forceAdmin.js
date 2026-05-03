const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb://YataraCeylon:YataraCeylon@ac-nl8fv2p-shard-00-00.ovgs0fc.mongodb.net:27017,ac-nl8fv2p-shard-00-01.ovgs0fc.mongodb.net:27017,ac-nl8fv2p-shard-00-02.ovgs0fc.mongodb.net:27017/?ssl=true&replicaSet=atlas-scwm0i-shard-0&authSource=admin&appName=Cluster0';

async function forceAdmin() {
  try {
    await mongoose.connect(MONGODB_URI);
    const db = mongoose.connection.db;
    
    // Forcibly update ANY user with admin@yataraceylon.com to be an ADMIN
    const result = await db.collection('users').updateOne(
      { email: 'admin@yataraceylon.com' },
      { $set: { role: 'ADMIN' } }
    );
    
    console.log(`Updated ${result.modifiedCount} users. Admin role enforced.`);
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

forceAdmin();
