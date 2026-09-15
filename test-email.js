require('dotenv').config();
const nodemailer = require('nodemailer');

const pass = process.env.EMAIL_PASS;
const user = process.env.EMAIL_USER;

console.log('===== DIAGNOSTIC =====');
console.log('EMAIL_USER:', user);
console.log('EMAIL_PASS length:', pass ? pass.length : 'MISSING');
console.log('EMAIL_PASS has spaces:', pass ? pass.includes(' ') : 'N/A');
console.log('EMAIL_PASS has quotes:', pass ? (pass.includes('"') || pass.includes("'")) : 'N/A');
console.log('EMAIL_PASS first 3 chars:', pass ? pass.substring(0, 3) : 'N/A');
console.log('EMAIL_PASS last 3 chars:', pass ? pass.slice(-3) : 'N/A');
console.log('======================');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user, pass }
});

transporter.verify(function(error, success) {
  if (error) {
    console.log('❌ LOGIN FAILED:', error.message);
  } else {
    console.log('✅ LOGIN SUCCESSFUL - Email will work!');
  }
});