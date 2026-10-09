// Admin Authentication Middleware
const jwt = require('jsonwebtoken');
const userModel = require('../users');

const adminAuth = async (req, res, next) => {
  try {
    let token = null;

    // 1. Check Authorization header first (standard for API / SPA fetch requests)
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (authHeader && typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
      const candidate = authHeader.substring(7).trim();
      if (candidate && candidate !== 'null' && candidate !== 'undefined') {
        token = candidate;
      }
    }

    // 2. Fall back to cookie if no Authorization header is present
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

    // Verify token
    jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, decoded) => {
      if (err) {
        console.log('Admin Auth - Token verification failed:', err.message);
        return res.status(401).json({ 
          success: false, 
          message: 'Invalid or expired session. Please login again.' 
        });
      }

      try {
        // Fetch user from DB to verify role
        const userDoc = await userModel.findById(decoded._id);
        
        if (!userDoc) {
          return res.status(401).json({ 
            success: false, 
            message: 'User account not found. Please login again.' 
          });
        }

        // Allow admin, staff, and subadmin
        if (userDoc.role !== 'admin' && userDoc.role !== 'staff' && userDoc.role !== 'subadmin') {
          console.warn(`Admin Auth - Access Denied: User ${userDoc.username} (${userDoc._id}) has role '${userDoc.role}'`);
          return res.status(403).json({ 
            success: false, 
            message: `Access denied. Current role is '${userDoc.role}'. Admin or Staff access required.` 
          });
        }

        req.user = decoded;
        req.userDoc = userDoc;
        next();
      } catch (dbErr) {
        console.error('Admin Auth - Database error:', dbErr);
        return res.status(500).json({ 
          success: false, 
          message: 'Internal server error while verifying user permissions' 
        });
      }
    });
  } catch (error) {
    console.error('Admin auth error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'An error occurred during authentication' 
    });
  }
};

module.exports = adminAuth;
