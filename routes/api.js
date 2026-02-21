// API Routes for Next.js Frontend (JSON responses only)

var express = require('express');
var router = express.Router();
const userModel = require('./users');
const jwt = require('jsonwebtoken');

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
      
      // Cookie settings for production (cross-domain)
      const cookieOptions = {
        httpOnly: true,
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        secure: process.env.NODE_ENV === 'production', // HTTPS only in production
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // Cross-site for production
        path: '/'
      };
      
      res.cookie('token', token, cookieOptions);

      return res.json({ 
        success: true, 
        message: 'Login successful',
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
    res.cookie('token', token, { 
      httpOnly: true,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      sameSite: 'lax'
    });

    return res.json({ 
      success: true, 
      message: 'Registration successful',
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
    res.clearCookie('token');
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

// Middleware
function isLoggedIn(req, res, next) {
  const token = req.cookies.token;

  if (token == null) {
    return res.status(401).json({ 
      success: false, 
      message: 'Not authenticated' 
    });
  }

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ 
        success: false, 
        message: 'Invalid token' 
      });
    }
    req.user = user;
    next();
  });
}

module.exports = router;
