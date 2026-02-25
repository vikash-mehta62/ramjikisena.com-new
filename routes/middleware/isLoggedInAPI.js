// Middleware to check if user is logged in (API version - returns JSON)
const jwt = require('jsonwebtoken');

function isLoggedInAPI(req, res, next) {
  console.log('=== isLoggedInAPI Middleware Called ===');
  
  // Try to get token from cookie first
  let token = req.cookies.token;
  console.log('Token from cookie:', token ? 'FOUND' : 'NOT FOUND');
  
  // If not in cookie, check Authorization header
  if (!token) {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    console.log('Authorization header:', authHeader ? 'FOUND' : 'NOT FOUND');
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
      console.log('Token extracted from header:', token ? 'SUCCESS' : 'FAILED');
    }
  }

  if (!token) {
    console.log('❌ No token found - returning 401');
    return res.status(401).json({ 
      success: false, 
      message: 'Not authenticated',
      debug: {
        cookiePresent: !!req.cookies.token,
        authHeaderPresent: !!(req.headers.authorization || req.headers.Authorization)
      }
    });
  }

  console.log('Verifying token...');
  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
    if (err) {
      console.log('❌ Token verification failed:', err.message);
      return res.status(403).json({ 
        success: false, 
        message: 'Invalid token',
        error: err.message
      });
    }
    console.log('✅ Token verified for user:', user._id);
    req.user = user;
    next();
  });
}

module.exports = isLoggedInAPI;
