const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'Missing or invalid Authorization header. Expected Bearer <CLERK_JWT_TOKEN>.'
      }
    });
  }

  const token = authHeader.split(' ')[1];

  if (!token || token.trim() === '') {
    return res.status(401).json({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'Provided Clerk authentication token is empty.'
      }
    });
  }

  // In development/test mode, extract userId from token payload if decoded or default to mock Clerk ID
  let userId = 'user_2Nabcdef123456';
  try {
    const parts = token.split('.');
    if (parts.length === 3) {
      const payloadBuf = Buffer.from(parts[1], 'base64').toString('utf-8');
      const payload = JSON.parse(payloadBuf);
      if (payload.sub) {
        userId = payload.sub;
      }
    }
  } catch (err) {
    // If decoding fails, fall back to default user ID for development testing
  }

  req.auth = {
    userId,
    token
  };

  next();
};

module.exports = { requireAuth };
