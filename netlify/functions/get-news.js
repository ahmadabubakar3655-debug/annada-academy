const { connectToDatabase } = require('./utils/db');

exports.handler = async function(event) {
  let attempts = 0;
  const maxAttempts = 3;

  while (attempts < maxAttempts) {
    try {
      const { db } = await connectToDatabase();
      const news = await db.collection('news')
        .find({})
        .sort({ createdAt: -1 })
        .toArray();

      return {
        statusCode: 200,
        body: JSON.stringify({ success: true, news })
      };
    } catch (error) {
      attempts++;
      console.log(`Attempt ${attempts} failed:`, error.message);
      
      if (attempts >= maxAttempts) {
        return {
          statusCode: 500,
          body: JSON.stringify({ 
            success: false, 
            error: error.message,
            attempts: attempts 
          })
        };
      }
      
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
};