const { connectToDatabase } = require('./utils/db');

exports.handler = async function(event) {
  try {
    const { db } = await connectToDatabase();
    const { name, email, message } = JSON.parse(event.body);

    if (!name || !email || !message) {
      return { statusCode: 400, body: JSON.stringify({ error: 'All fields are required' }) };
    }

    const result = await db.collection('contacts').insertOne({
      name, email, message,
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