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

  const client = new MongoClient(uri, {
    connectTimeoutMS: 120000,    // 2 minutes
    socketTimeoutMS: 120000,
    serverSelectionTimeoutMS: 120000,
    heartbeatFrequencyMS: 10000
  });
  
  await client.connect();
  
  const db = client.db('annada_academy');

  cachedClient = client;
  cachedDb = db;

  return { client, db };
}

module.exports = { connectToDatabase };