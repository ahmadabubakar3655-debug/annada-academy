const { connectToDatabase } = require('./utils/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.handler = async function(event) {
  try {
    const { db } = await connectToDatabase();
    const { username, password } = JSON.parse(event.body);
    const user = await db.collection('users').findOne({ username });
    if (!user) {
      return { statusCode: 401, body: JSON.stringify({ error: 'Invalid credentials' }) };
    }
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return { statusCode: 401, body: JSON.stringify({ error: 'Invalid credentials' }) };
    }
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );
    return {
      statusCode: 200,
      body: JSON.stringify({ token, username: user.username })
    };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};