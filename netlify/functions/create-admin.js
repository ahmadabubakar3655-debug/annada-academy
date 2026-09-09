const { connectToDatabase } = require('./utils/db');
const bcrypt = require('bcryptjs');

exports.handler = async function() {
  try {
    const { db } = await connectToDatabase();
    const existing = await db.collection('users').findOne({ username: 'admin' });
    if (existing) {
      return { statusCode: 200, body: JSON.stringify({ message: 'Admin already exists' }) };
    }
    const hashed = await bcrypt.hash('admin123', 10);
    await db.collection('users').insertOne({
      username: 'admin',
      password: hashed,
      role: 'admin',
      createdAt: new Date()
    });
    return {
      statusCode: 201,
      body: JSON.stringify({
        message: 'Admin created!',
        username: 'admin',
        password: 'admin123'
      })
    };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};