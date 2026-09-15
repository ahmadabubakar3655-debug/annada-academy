const { connectToDatabase } = require('./utils/db');
const jwt = require('jsonwebtoken');
const { ObjectId } = require('mongodb');

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
    const { id } = JSON.parse(event.body);

    if (!id) {
      return { statusCode: 400, body: JSON.stringify({ error: 'ID is required' }) };
    }

    await db.collection('hifz').deleteOne({ _id: new ObjectId(id) });

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true })
    };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};