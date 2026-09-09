const { connectToDatabase } = require('./utils/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.handler = async function(event) {
  try {
    const { db } = await connectToDatabase();
    const students = db.collection('students');

    const { token, newPassword } = JSON.parse(event.body);

    if (!token || !newPassword) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Token and new password are required' })
      };
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    } catch {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: 'Invalid or expired token' })
      };
    }

    // Find student with this token
    const student = await students.findOne({
      email: decoded.email,
      resetToken: token,
      resetTokenExpires: { $gt: new Date() }
    });

    if (!student) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Invalid or expired reset token' })
      };
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password and clear reset token
    await students.updateOne(
      { _id: student._id },
      {
        $set: { password: hashedPassword },
        $unset: { resetToken: "", resetTokenExpires: "" }
      }
    );

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: 'Password reset successful!'
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};