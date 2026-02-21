// Admin Authentication Middleware
const jwt = require('jsonwebtoken');
const userModel = require('../users');

const adminAuth = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication required' 
      });
    }

    // Verify token
    jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, user) => {
      if (err) {
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
