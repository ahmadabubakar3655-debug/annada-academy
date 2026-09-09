exports.handler = async function() {
  return {
    statusCode: 200,
    body: JSON.stringify({
      mongodb_uri: process.env.MONGODB_URI ? 'Set' : 'Not set',
      jwt_secret: process.env.JWT_SECRET ? 'Set' : 'Not set'
    })
  };
};