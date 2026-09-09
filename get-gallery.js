const { connectToDatabase } = require('./utils/db');

exports.handler = async function(event, context) {
  try {
    const { db } = await connectToDatabase();
    const gallery = db.collection('gallery');

    const allImages = await gallery.find({})
      .sort({ createdAt: -1 })
      .toArray();

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        images: allImages
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};