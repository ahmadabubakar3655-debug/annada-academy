const { connectToDatabase } = require('./utils/db');

exports.handler = async function(event, context) {
  try {
    const { db } = await connectToDatabase();
    const news = db.collection('news');

    const allNews = await news.find({})
      .sort({ createdAt: -1 })
      .toArray();

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        news: allNews
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};