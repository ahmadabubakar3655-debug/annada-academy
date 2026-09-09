const { connectToDatabase } = require('./utils/db');
const bcrypt = require('bcryptjs');

exports.handler = async function(event) {
  try {
    const { db } = await connectToDatabase();
    const students = db.collection('students');

    const { name, email, password, phone, grade } = JSON.parse(event.body);

    // Check if student already exists
    const existing = await students.findOne({ email });
    if (existing) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Student with this email already exists' })
      };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save student
    const result = await students.insertOne({
      name,
      email,
      password: hashedPassword,
      phone: phone || '',
      grade: grade || 'Not specified',
      createdAt: new Date()
    });

    return {
      statusCode: 201,
      body: JSON.stringify({
        success: true,
        message: 'Student registered successfully!',
        id: result.insertedId
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};