const { connectToDatabase } = require('./utils/db');

exports.handler = async function() {
  try {
    const { db } = await connectToDatabase();
    const images = await db.collection('gallery').find({}).sort({ createdAt: -1 }).toArray();
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, images })
    };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};