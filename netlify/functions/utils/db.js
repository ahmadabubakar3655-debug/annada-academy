// Force Node.js to use public DNS servers (fixes SRV DNS issues)
const dns = require('dns');
dns.setServers(['1.1.1.1', '8.8.8.8']);

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
    connectTimeoutMS: 30000,
    socketTimeoutMS: 30000,
    serverSelectionTimeoutMS: 30000
  });
  
  await client.connect();
  const db = client.db('annada_academy');

  cachedClient = client;
  cachedDb = db;

  return { client, db };
}

module.exports = { connectToDatabase };