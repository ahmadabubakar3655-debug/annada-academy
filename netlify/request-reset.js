const { connectToDatabase } = require('./utils/db');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

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

    // Generate reset link
    const resetLink = `https://annada-academy.netlify.app/reset-password?token=${resetToken}`;

    // --- SEND EMAIL ---
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset - Annada Academy',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #F7F3EC; border-radius: 10px;">
          <div style="text-align: center; padding: 20px 0; background: #1B2A4A; border-radius: 10px 10px 0 0;">
            <h1 style="color: #C9A24B; margin: 0; font-size: 24px;">Annada Academy</h1>
            <p style="color: white; margin: 5px 0 0 0;">Password Reset</p>
          </div>
          <div style="padding: 30px; background: white; border-radius: 0 0 10px 10px;">
            <p style="color: #333; font-size: 16px;">Hello <strong>${student.name}</strong>,</p>
            <p style="color: #555; font-size: 15px; line-height: 1.6;">
              We received a request to reset your password for your Annada Academy account.
            </p>
            <p style="color: #555; font-size: 15px; line-height: 1.6;">
              Click the button below to reset your password. This link will expire in <strong>1 hour</strong>.
            </p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetLink}" style="background: #C9A24B; color: #1B2A4A; padding: 14px 40px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; display: inline-block;">
                Reset Password
              </a>
            </div>
            <p style="color: #999; font-size: 13px; text-align: center; margin-top: 20px;">
              If you didn't request this, please ignore this email.<br>
              This link will expire in 1 hour.
            </p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="color: #999; font-size: 12px; text-align: center;">
              © 2026 Annada Qur'an & Science Academy<br>
              Kudan, Kaduna State, Nigeria
            </p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: 'Password reset link sent to your email!'
      })
    };
  } catch (error) {
    console.error('Reset error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};