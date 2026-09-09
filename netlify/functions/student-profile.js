const { connectToDatabase } = require('./utils/db');
const jwt = require('jsonwebtoken');
const { ObjectId } = require('mongodb');

exports.handler = async function(event) {
  try {
    const token = event.headers.authorization?.split(' ')[1];
    if (!token) {
      return { statusCode: 401, body: JSON.stringify({ error: 'Unauthorized' }) };
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    } catch {
      return { statusCode: 401, body: JSON.stringify({ error: 'Invalid token' }) };
    }

    const { db } = await connectToDatabase();
    const student = await db.collection('students').findOne(
      { _id: new ObjectId(decoded.id) },
      { projection: { password: 0 } } // Exclude password
    );

    if (!student) {
      return { statusCode: 404, body: JSON.stringify({ error: 'Student not found' }) };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, student })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};