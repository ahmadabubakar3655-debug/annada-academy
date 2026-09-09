const { connectToDatabase } = require('./utils/db');

exports.handler = async function() {
  try {
    const { db } = await connectToDatabase();
    const contacts = await db.collection('contacts').find({}).sort({ createdAt: -1 }).toArray();
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, contacts })
    };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};