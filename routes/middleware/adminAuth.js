// Admin Authentication Middleware
const jwt = require('jsonwebtoken');
const userModel = require('../users');

const adminAuth = async (req, res, next) => {
  try {
    // Try to get token from cookie first
    let token = req.cookies.token;
    
    // If not in cookie, check Authorization header
    if (!token) {
      const authHeader = req.headers.authorization || req.headers.Authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }

    console.log('Admin Auth - Token check:', {
      hasCookie: !!req.cookies.token,
      hasAuthHeader: !!(req.headers.authorization || req.headers.Authorization),
      hasToken: !!token
    });

    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication required' 
      });
    }

    // Verify token
    jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, user) => {
      if (err) {
        console.log('Admin Auth - Token verification failed:', err.message);
        return res.status(403).json({ 
          success: false, 
          message: 'Invalid token' 
        });
      }

      // Check if user is admin
      const userDoc = await userModel.findById(user._id);
      
      if (!userDoc) {
        return res.status(404).json({ 
          success: false, 
          message: 'User not found' 
        });
      }

      if (userDoc.role !== 'admin') {
        return res.status(403).json({ 
          success: false, 
          message: 'Admin access required' 
        });
      }

      console.log('Admin Auth - Success for user:', user._id);
      req.user = user;
      next();
    });
  } catch (error) {
    console.error('Admin auth error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'An error occurred' 
    });
  }
};

module.exports = adminAuth;
