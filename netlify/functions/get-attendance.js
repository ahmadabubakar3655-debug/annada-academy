const { connectToDatabase } = require('./utils/db');
const { ObjectId } = require('mongodb');

exports.handler = async function(event) {
  try {
    const { db } = await connectToDatabase();
    const studentId = event.queryStringParameters?.studentId;
    const date = event.queryStringParameters?.date;

    let query = {};
    if (studentId) query.studentId = new ObjectId(studentId);
    if (date) query.date = date;

    const records = await db.collection('attendance')
      .find(query)
      .sort({ date: -1 })
      .toArray();

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, records })
    };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};