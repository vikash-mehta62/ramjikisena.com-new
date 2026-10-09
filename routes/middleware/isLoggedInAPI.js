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
  if (!token && req.cookies && req.cookies.token) {
    const cookieCandidate = String(req.cookies.token).trim();
    if (cookieCandidate && cookieCandidate !== 'null' && cookieCandidate !== 'undefined') {
      token = cookieCandidate;
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
