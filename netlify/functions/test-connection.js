const { connectToDatabase } = require('./utils/db');

exports.handler = async function() {
  try {
    const { db } = await connectToDatabase();
    const collections = await db.listCollections().toArray();
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        collections: collections.map(c => c.name)
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: error.message
      })
    };
  }
};