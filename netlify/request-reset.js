const { connectToDatabase } = require('./utils/db');
const jwt = require('jsonwebtoken');

exports.handler = async function(event) {
  try {
    const { db } = await connectToDatabase();
    const students = db.collection('students');

    const { email } = JSON.parse(event.body);

    if (!email) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Email is required' })
      };
    }

    // Check if student exists
    const student = await students.findOne({ email });
    if (!student) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'No account found with this email' })
      };
    }

    // Create reset token (expires in 1 hour)
    const resetToken = jwt.sign(
      { email: student.email, id: student._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1h' }
    );

    // Save reset token to database
    await students.updateOne(
      { _id: student._id },
      { $set: { resetToken: resetToken, resetTokenExpires: new Date(Date.now() + 3600000) } }
    );

    // For now, we'll just return the reset link (in production, send email)
    const resetLink = `${process.env.URL || 'http://localhost:8889'}/reset-password?token=${resetToken}`;

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: 'Password reset link generated!',
        resetLink: resetLink // Show this to user (in production, email it)
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};