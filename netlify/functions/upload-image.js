const { connectToDatabase } = require('./utils/db');
const jwt = require('jsonwebtoken');

exports.handler = async function(event) {
  try {
    const token = event.headers.authorization?.split(' ')[1];
    if (!token) {
      return { statusCode: 401, body: JSON.stringify({ error: 'Unauthorized' }) };
    }
    jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const { db } = await connectToDatabase();
    const { title, imageData } = JSON.parse(event.body);
    if (!title || !imageData) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Title and image required' }) };
    }
    const result = await db.collection('gallery').insertOne({
      title,
      imageData,
      createdAt: new Date()
    });
    return {
      statusCode: 201,
      body: JSON.stringify({ success: true, id: result.insertedId })
    };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};