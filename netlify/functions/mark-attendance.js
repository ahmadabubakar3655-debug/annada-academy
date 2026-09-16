const { connectToDatabase } = require('./utils/db');
const jwt = require('jsonwebtoken');
const { ObjectId } = require('mongodb');

exports.handler = async function(event) {
  try {
    const token = event.headers.authorization?.split(' ')[1];
    if (!token) return { statusCode: 401, body: JSON.stringify({ error: 'Unauthorized' }) };
    
    try {
      jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    } catch {
      return { statusCode: 401, body: JSON.stringify({ error: 'Invalid token' }) };
    }

    const { db } = await connectToDatabase();
    const { date, attendance } = JSON.parse(event.body);

    if (!date || !attendance || !Array.isArray(attendance)) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Date and attendance array required' }) };
    }

    // Delete existing attendance for this date (to allow re-marking)
    await db.collection('attendance').deleteMany({ date });

    // Prepare records
    const records = [];
    for (const entry of attendance) {
      if (entry.status) {  // only save if status is set
        const student = await db.collection('students').findOne({ _id: new ObjectId(entry.studentId) });
        if (student) {
          records.push({
            studentId: new ObjectId(entry.studentId),
            studentName: student.name,
            studentGrade: student.grade || 'N/A',
            date: date,
            status: entry.status, // 'present', 'absent', 'late'
            notes: entry.notes || '',
            markedAt: new Date()
          });
        }
      }
    }

    if (records.length > 0) {
      await db.collection('attendance').insertMany(records);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, count: records.length })
    };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};