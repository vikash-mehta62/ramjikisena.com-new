// Middleware to check if user is logged in (API version - returns JSON)
const jwt = require('jsonwebtoken');

function isLoggedInAPI(req, res, next) {
  let token = null;

  // 1. Check Authorization header first
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (authHeader && typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
    const candidate = authHeader.substring(7).trim();
    if (candidate && candidate !== 'null' && candidate !== 'undefined') {
      token = candidate;
    }
  }

  // 2. Fall back to cookie
  if (!token && req.cookies) {
    const cookieCandidate = req.cookies.token || req.cookies.panditToken || req.cookies.astrologerToken;
    if (cookieCandidate) {
      const trimmed = String(cookieCandidate).trim();
      if (trimmed && trimmed !== 'null' && trimmed !== 'undefined') {
        token = trimmed;
      }
    }
  }

  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: 'Authentication required. Please login.' 
    });
  }

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
    if (err) {
      console.log('❌ isLoggedInAPI token verification failed:', err.message);
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid or expired session. Please login again.',
        error: err.message
      });
    }
    req.user = user;
    next();
  });
}

module.exports = isLoggedInAPI;
