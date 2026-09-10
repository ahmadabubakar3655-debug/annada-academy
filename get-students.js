const { connectToDatabase } = require('./utils/db');
const jwt = require('jsonwebtoken');

exports.handler = async function(event) {
  try {
    const token = event.headers.authorization?.split(' ')[1];
    if (!token) {
      return { statusCode: 401, body: JSON.stringify({ error: 'Unauthorized' }) };
    }

    try {
      jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    } catch {
      return { statusCode: 401, body: JSON.stringify({ error: 'Invalid token' }) };
    }

    const { db } = await connectToDatabase();
    const students = await db.collection('students')
      .find({}, { projection: { password: 0 } })
      .sort({ createdAt: -1 })
      .toArray();

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, students })
    };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};