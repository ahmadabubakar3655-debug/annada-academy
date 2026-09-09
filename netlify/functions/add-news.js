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
    const { title, content } = JSON.parse(event.body);
    if (!title || !content) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Title and content required' }) };
    }
    const result = await db.collection('news').insertOne({
      title,
      content,
      date: new Date().toISOString().split('T')[0],
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