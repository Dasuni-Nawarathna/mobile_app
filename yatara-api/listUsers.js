const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb://YataraCeylon:YataraCeylon@ac-nl8fv2p-shard-00-00.ovgs0fc.mongodb.net:27017,ac-nl8fv2p-shard-00-01.ovgs0fc.mongodb.net:27017,ac-nl8fv2p-shard-00-02.ovgs0fc.mongodb.net:27017/?ssl=true&replicaSet=atlas-scwm0i-shard-0&authSource=admin&appName=Cluster0';

async function listUsers() {
  try {
    await mongoose.connect(MONGODB_URI);
    const db = mongoose.connection.db;
    
    const users = await db.collection('users').find({}).toArray();
    console.log(users.map(u => `${u.email} - ${u.role}`));
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

listUsers();
