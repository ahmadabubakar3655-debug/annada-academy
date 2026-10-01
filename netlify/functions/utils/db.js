const { MongoClient } = require('mongodb');

let cachedClient = null;
let cachedDb = null;

async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const uri = process.env.MONGODB_URI;
  
  if (!uri) {
    throw new Error('MONGODB_URI environment variable is not set');
  }

  console.log('Connecting to MongoDB...');

  const client = new MongoClient(uri, {
    // Longer timeouts to survive Atlas cold starts on free tier
    connectTimeoutMS: 30000,
    socketTimeoutMS: 30000,
    serverSelectionTimeoutMS: 30000,
    // Keep connections alive between function calls
    maxPoolSize: 10,
    minPoolSize: 1,
    maxIdleTimeMS: 30000
  });

  await client.connect();
  console.log('MongoDB connected!');

  const db = client.db('annada_academy');

  cachedClient = client;
  cachedDb = db;

  return { client, db };
}

module.exports = { connectToDatabase };