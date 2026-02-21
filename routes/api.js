// API Routes for Next.js Frontend (JSON responses only)

var express = require('express');
var router = express.Router();
const userModel = require('./users');
const jwt = require('jsonwebtoken');

// Test endpoint (no auth required)
router.get('/test', function (req, res) {
  return res.json({ 
    success: true, 
    message: 'API is working',
    timestamp: new Date().toISOString(),
    headers: {
      cookie: req.headers.cookie || 'none',
      authorization: req.headers.authorization || 'none'
    }
  });
});

// API Login (JSON response)
router.post('/login', async function (req, res) {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Username and password are required' 
      });
    }

    const userExist = await userModel.findOne({ username });
    if (!userExist) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }

    const isPasswordValid = await userExist.comparePassword(password);
    
    if (isPasswordValid) {
      const token = await userExist.generateToken();
      
      // Try to set cookie (optional - if it fails, token is still in response)
      try {
        const isProduction = process.env.NODE_ENV === 'production';
        const cookieOptions = {
          httpOnly: true,
          expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          path: '/'
        };
        
        // Only add secure and sameSite in production
        if (isProduction) {
          cookieOptions.secure = true;
          cookieOptions.sameSite = 'none';
        }
        
        res.cookie('token', token, cookieOptions);
      } catch (cookieError) {
        console.log('Cookie setting failed (not critical):', cookieError.message);
      }

      // ALWAYS send token in response (main authentication method)
      return res.json({ 
        success: true, 
        message: 'Login successful',
        token: token, // Send token in response
        user: {
          _id: userExist._id,
          username: userExist.username,
          name: userExist.name,
          city: userExist.city,
          role: userExist.role,
          rank: userExist.rank,
          totalCount: userExist.totalCount,
          mala: userExist.mala
        },
        redirect: userExist.role === 'admin' ? '/admin/dashboard' : '/dashboard'
      });
    } else {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'An error occurred during login' 
    });
  }
});

// API Register (JSON response)
router.post('/register', async function (req, res) {
  try {
    const { username, name, city, password, contact } = req.body;

    // Validation
    if (!username || !name || !password || !contact) {
      return res.status(400).json({ 
        success: false, 
        message: 'All fields are required' 
      });
    }

    if (!/^([0-9]{10})$/.test(contact)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Contact number should be 10 digits' 
      });
    }

    // Check existing contact
    const existingUserContact = await userModel.findOne({ contact });
    if (existingUserContact) {
      return res.status(400).json({ 
        success: false, 
        message: 'This contact already exists' 
      });
    }

    // Check existing username
    const existingUserUsername = await userModel.findOne({ username });
    if (existingUserUsername) {
      return res.status(400).json({ 
        success: false, 
        message: 'This username already exists' 
      });
    }

    // Create user
    const data = await userModel.create({ 
      username, 
      name, 
      city, 
      contact, 
      password 
    });

    const token = await data.generateToken();
    
    // Try to set cookie (optional - if it fails, token is still in response)
    try {
      const isProduction = process.env.NODE_ENV === 'production';
      const cookieOptions = {
        httpOnly: true,
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        path: '/'
      };
      
      // Only add secure and sameSite in production
      if (isProduction) {
        cookieOptions.secure = true;
        cookieOptions.sameSite = 'none';
      }
      
      res.cookie('token', token, cookieOptions);
    } catch (cookieError) {
      console.log('Cookie setting failed (not critical):', cookieError.message);
    }

    // ALWAYS send token in response (main authentication method)
    return res.json({ 
      success: true, 
      message: 'Registration successful',
      token: token, // Send token in response
      user: {
        _id: data._id,
        username: data.username,
        name: data.name,
        city: data.city,
        role: data.role
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'An error occurred during registration' 
    });
  }
});

// API Get Current User (JSON response)
router.get('/me', isLoggedIn, async function (req, res) {
  try {
    const user = req.user;
    const loggedInUser = await userModel.findOne({ _id: user._id });
    
    if (!loggedInUser) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    return res.json({ 
      success: true,
      user: {
        _id: loggedInUser._id,
        username: loggedInUser.username,
        name: loggedInUser.name,
        city: loggedInUser.city,
        contact: loggedInUser.contact,
        rank: loggedInUser.rank,
        currCount: loggedInUser.currCount,
        totalCount: loggedInUser.totalCount,
        mala: loggedInUser.mala,
        role: loggedInUser.role,
        dailyCounts: loggedInUser.dailyCounts
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'An error occurred' 
    });
  }
});

// API Save Count (JSON response)
router.post('/save', isLoggedIn, async function (req, res) {
  try {
    const user = req.user;
    const loggedInUser = await userModel.findOne({ _id: user._id });
    const { currentCount, totalCount, malaCount } = req.body;

    loggedInUser.totalCount += parseInt(currentCount);
    loggedInUser.mala = loggedInUser.totalCount !== 0 ? (loggedInUser.totalCount / 108).toFixed(2) : 0.00;
    loggedInUser.currCount = 0;

    // Update dailyCounts
    const today = new Date();
    const hasEntryForToday = loggedInUser.dailyCounts &&
      loggedInUser.dailyCounts.length > 0 &&
      loggedInUser.dailyCounts[loggedInUser.dailyCounts.length - 1].date.toDateString() === today.toDateString();

    if (hasEntryForToday) {
      loggedInUser.dailyCounts[loggedInUser.dailyCounts.length - 1].count += parseInt(currentCount);
    } else {
      loggedInUser.dailyCounts.push({ date: today, count: parseInt(currentCount) });
    }

    await loggedInUser.save();

    return res.json({ 
      success: true, 
      message: 'Counts updated successfully',
      user: {
        totalCount: loggedInUser.totalCount,
        mala: loggedInUser.mala,
        currCount: loggedInUser.currCount
      }
    });
  } catch (error) {
    console.error('Save count error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'An error occurred while saving' 
    });
  }
});

// API Logout (JSON response)
router.get('/logout', (req, res) => {
  try {
    // Try to clear cookie (optional)
    try {
      res.clearCookie('token', { path: '/' });
    } catch (cookieError) {
      console.log('Cookie clearing failed (not critical):', cookieError.message);
    }
    
    return res.json({ 
      success: true, 
      message: 'Logged out successfully' 
    });
  } catch (err) {
    console.error("Error during logout:", err);
    return res.status(500).json({ 
      success: false, 
      message: 'Logout failed' 
    });
  }
});

// Middleware - Check token from cookie OR Authorization header
function isLoggedIn(req, res, next) {
  console.log('=== isLoggedIn Middleware Called ===');
  console.log('Request URL:', req.url);
  console.log('Request Method:', req.method);
  console.log('All Headers:', JSON.stringify(req.headers, null, 2));
  
  // Try to get token from cookie first
  let token = req.cookies.token;
  console.log('Token from cookie:', token ? token.substring(0, 20) + '...' : 'NOT FOUND');
  
  // If not in cookie, check Authorization header (case-insensitive)
  if (!token) {
    console.log('Checking authorization header...');
    const authHeader = req.headers.authorization || req.headers.Authorization;
    console.log('Auth header value:', authHeader || 'NOT FOUND');
    
    if (authHeader) {
      console.log('Auth header starts with Bearer?', authHeader.startsWith('Bearer '));
      if (authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
        console.log('Token extracted from header:', token.substring(0, 20) + '...');
      }
    }
  }

  // Debug logging
  console.log('Final token status:', {
    hasCookie: !!req.cookies.token,
    hasAuthHeader: !!(req.headers.authorization || req.headers.Authorization),
    hasToken: !!token,
    tokenLength: token ? token.length : 0
  });

  if (!token) {
    console.log('❌ No token found - returning 401');
    return res.status(401).json({ 
      success: false, 
      message: 'Not authenticated',
      debug: {
        cookiePresent: !!req.cookies.token,
        authHeaderPresent: !!(req.headers.authorization || req.headers.Authorization),
        allHeaders: Object.keys(req.headers)
      }
    });
  }

  console.log('Verifying token with JWT_SECRET_KEY...');
  console.log('JWT_SECRET_KEY exists?', !!process.env.JWT_SECRET_KEY);
  
  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
    if (err) {
      console.log('❌ Token verification failed:', err.message);
      console.log('Error details:', err);
      return res.status(403).json({ 
        success: false, 
        message: 'Invalid token',
        error: err.message
      });
    }
    console.log('✅ Token verified successfully for user:', user._id);
    req.user = user;
    next();
  });
}

module.exports = router;
