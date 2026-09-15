const { connectToDatabase } = require('./utils/db');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

exports.handler = async function(event) {
  try {
    const { db } = await connectToDatabase();
    const students = db.collection('students');

    const { email } = JSON.parse(event.body);

    if (!email) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Email is required' }) };
    }

    const student = await students.findOne({ email });
    if (!student) {
      return { statusCode: 404, body: JSON.stringify({ error: 'No account found with this email' }) };
    }

    // Generate secure 6-digit OTP using crypto (not Math.random!)
    const otp = crypto.randomInt(100000, 999999).toString();

    // Hash OTP before storing (never store plain OTP in database)
    const hashedOtp = await bcrypt.hash(otp, 10);

    // OTP expires in 10 minutes
    const expiry = new Date(Date.now() + 10 * 60 * 1000);

    // Save to student record
    await students.updateOne(
      { _id: student._id },
      {
        $set: {
          resetOtp: hashedOtp,
          resetOtpExpiry: expiry,
          resetOtpAttempts: 0
        }
      }
    );

    // Send email with the OTP
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: `"Halqatul Qur'anil Karim" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Password Reset Code - Halqatul Qur\'anil Karim',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #F7F3EC; border-radius: 10px;">
          <div style="text-align: center; padding: 20px 0; background: #1B2A4A; border-radius: 10px 10px 0 0;">
            <h1 style="color: #C9A24B; margin: 0; font-size: 22px;">Halqatul Qur'anil Karim</h1>
            <p style="color: white; margin: 5px 0 0 0;">Password Reset</p>
          </div>
          <div style="padding: 30px; background: white; border-radius: 0 0 10px 10px;">
            <p style="color: #333; font-size: 16px;">Hello <strong>${student.name}</strong>,</p>
            <p style="color: #555; font-size: 15px; line-height: 1.6;">
              You requested to reset your password. Use the code below:
            </p>
            <div style="text-align: center; margin: 30px 0;">
              <div style="display: inline-block; background: #F7F3EC; border: 2px dashed #C9A24B; padding: 20px 40px; border-radius: 10px;">
                <div style="font-size: 42px; font-weight: 700; letter-spacing: 10px; color: #1B2A4A; font-family: 'Courier New', monospace;">
                  ${otp}
                </div>
              </div>
            </div>
            <p style="color: #555; font-size: 15px; line-height: 1.6; text-align: center;">
              This code will expire in <strong>10 minutes</strong>.
            </p>
            <p style="color: #999; font-size: 13px; text-align: center; margin-top: 20px;">
              If you didn't request this, please ignore this email. Your password will remain unchanged.
            </p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="color: #999; font-size: 12px; text-align: center;">
              © ${new Date().getFullYear()} Halqatul Qur'anil Karim<br>
              Sabon Garin Kudan, Kaduna State, Nigeria
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
        message: 'OTP sent to your email!'
      })
    };
  } catch (error) {
    console.error('Reset OTP error:', error);
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};