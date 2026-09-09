const { connectToDatabase } = require('./utils/db');
const bcrypt = require('bcryptjs');

exports.handler = async function(event, context) {
  try {
    const { db } = await connectToDatabase();
    const users = db.collection('users');

    const existingAdmin = await users.findOne({ username: 'admin' });
    
    if (existingAdmin) {
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Admin user already exists!' })
      };
    }

    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    await users.insertOne({
      username: 'admin',
      password: hashedPassword,
      role: 'admin',
      createdAt: new Date()
    });

    return {
      statusCode: 201,
      body: JSON.stringify({
        message: 'Admin user created successfully!',
        username: 'admin',
        password: 'admin123'
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};