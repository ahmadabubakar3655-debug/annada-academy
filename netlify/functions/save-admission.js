const { connectToDatabase } = require('./utils/db');

exports.handler = async function(event) {
  try {
    const { db } = await connectToDatabase();
    const { parentName, studentName, email, phone, grade, message } = JSON.parse(event.body);

    if (!parentName || !studentName || !email || !phone) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Required fields missing' }) };
    }

    const result = await db.collection('admissions').insertOne({
      parentName, studentName, email, phone, grade, message,
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