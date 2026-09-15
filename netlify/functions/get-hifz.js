const { connectToDatabase } = require('./utils/db');
const { ObjectId } = require('mongodb');

exports.handler = async function(event) {
  try {
    const { db } = await connectToDatabase();
    const studentId = event.queryStringParameters?.studentId;

    // If studentId given, return that student's records only
    // Otherwise return all records (for admin)
    const query = studentId ? { studentId: new ObjectId(studentId) } : {};

    const records = await db.collection('hifz')
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, records })
    };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};