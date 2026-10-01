const { connectToDatabase } = require('./utils/db');

exports.handler = async function(event) {
  try {
    const { db } = await connectToDatabase();
    
    // Only return the 10 most recent images to keep response under 6MB
    const images = await db.collection('gallery')
      .find({})
      .sort({ createdAt: -1 })
      .limit(10)
      .toArray();

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        success: true, 
        count: images.length,
        images: images 
      })
    };
  } catch (error) {
    console.error('Gallery error:', error.message);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        success: false, 
        error: error.message 
      })
    };
  }
};