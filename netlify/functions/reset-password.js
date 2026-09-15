const { connectToDatabase } = require('./utils/db');
const bcrypt = require('bcryptjs');

exports.handler = async function(event) {
  try {
    const { db } = await connectToDatabase();
    const students = db.collection('students');

    const { email, otp, newPassword } = JSON.parse(event.body);

    // Validate input
    if (!email || !otp || !newPassword) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Email, OTP, and new password are required' }) };
    }

    if (newPassword.length < 6) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Password must be at least 6 characters' }) };
    }

    if (!/^\d{6}$/.test(otp)) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Invalid OTP format' }) };
    }

    // Find student
    const student = await students.findOne({ email });
    if (!student) {
      return { statusCode: 404, body: JSON.stringify({ error: 'Student not found' }) };
    }

    // Check if OTP was ever requested
    if (!student.resetOtp || !student.resetOtpExpiry) {
      return { statusCode: 400, body: JSON.stringify({ error: 'No reset code was requested. Please request a new one.' }) };
    }

    // Check expiry
    if (new Date() > new Date(student.resetOtpExpiry)) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Code has expired. Please request a new one.' }) };
    }

    // Rate limit — max 5 wrong attempts
    const attempts = student.resetOtpAttempts || 0;
    if (attempts >= 5) {
      return { statusCode: 429, body: JSON.stringify({ error: 'Too many failed attempts. Please request a new code.' }) };
    }

    // Verify OTP against stored hash
    const isValid = await bcrypt.compare(otp, student.resetOtp);
    if (!isValid) {
      // Increment failed attempts
      await students.updateOne(
        { _id: student._id },
        { $inc: { resetOtpAttempts: 1 } }
      );
      return { statusCode: 401, body: JSON.stringify({ error: 'Incorrect code. Please try again.' }) };
    }

    // Success — hash new password and clear OTP fields
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await students.updateOne(
      { _id: student._id },
      {
        $set: { password: hashedPassword },
        $unset: { resetOtp: "", resetOtpExpiry: "", resetOtpAttempts: "" }
      }
    );

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, message: 'Password reset successful!' })
    };
  } catch (error) {
    console.error('Reset password error:', error);
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};