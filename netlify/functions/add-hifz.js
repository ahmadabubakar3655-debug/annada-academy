const { connectToDatabase } = require('./utils/db');
const jwt = require('jsonwebtoken');
const { ObjectId } = require('mongodb');

exports.handler = async function(event) {
  try {
    const token = event.headers.authorization?.split(' ')[1];
    if (!token) {
      return { statusCode: 401, body: JSON.stringify({ error: 'Unauthorized' }) };
    }

    try {
      jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    } catch {
      return { statusCode: 401, body: JSON.stringify({ error: 'Invalid token' }) };
    }

    const { db } = await connectToDatabase();
    const { studentId, surahName, surahNumber, juzNumber, pages, status, notes } = JSON.parse(event.body);

    if (!studentId || !surahName || !surahNumber) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Student, Surah name, and Surah number are required' }) };
    }

    // Get student info for easy lookup
    const student = await db.collection('students').findOne({ _id: new ObjectId(studentId) });
    if (!student) {
      return { statusCode: 404, body: JSON.stringify({ error: 'Student not found' }) };
    }

    const result = await db.collection('hifz').insertOne({
      studentId: new ObjectId(studentId),
      studentName: student.name,
      studentEmail: student.email,
      studentGrade: student.grade || 'N/A',
      surahName,
      surahNumber: parseInt(surahNumber),
      juzNumber: juzNumber ? parseInt(juzNumber) : null,
      pages: pages || '',
      status: status || 'memorized',
      notes: notes || '',
      dateRecorded: new Date(),
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