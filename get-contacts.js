const { connectToDatabase } = require('./utils/db');

exports.handler = async function(event, context) {
  try {
    const { db } = await connectToDatabase();
    const contacts = db.collection('contacts');

    const allContacts = await contacts.find({})
      .sort({ createdAt: -1 })
      .toArray();

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        contacts: allContacts
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};