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
    
    const newsCount = await db.collection('news').countDocuments();
    const galleryCount = await db.collection('gallery').countDocuments();
    const contactCount = await db.collection('contacts').countDocuments();

    return {
      statusCode: 200,
      body: JSON.stringify({
        news: newsCount,
        gallery: galleryCount,
        contacts: contactCount
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};