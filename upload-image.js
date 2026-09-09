const { connectToDatabase } = require('./utils/db');
const jwt = require('jsonwebtoken');

exports.handler = async function(event, context) {
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
    const gallery = db.collection('gallery');

    const { title, imageData } = JSON.parse(event.body);

    if (!title || !imageData) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Title and image are required' })
      };
    }

    const result = await gallery.insertOne({
      title,
      imageData: imageData,
      createdAt: new Date()
    });

    return {
      statusCode: 201,
      body: JSON.stringify({
        success: true,
        message: 'Image uploaded successfully',
        id: result.insertedId
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};