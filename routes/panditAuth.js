// Pandit Authentication Routes
const express = require('express');
const router = express.Router();
const Pandit = require('../models/Pandit');
const userModel = require('./users');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Pandit Registration
router.post('/register', async (req, res) => {
  try {
    const {
      name,
      username,
      phone,
      email,
      password,
      city,
      state,
      experience,
      specialization,
      languages
    } = req.body;

    // Validation
    if (!name || !username || !phone || !password || !city || !state) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields (name, username, phone, password, city, state)'
      });
    }

    // Check if username already exists
    const existingUsername = await Pandit.findOne({ username: username.toLowerCase() });
    if (existingUsername) {
      return res.status(400).json({
        success: false,
        message: 'Username already taken. Please choose another.'
      });
    }

    // Check if phone already exists
    const existingPhone = await Pandit.findOne({ 'contact.phone': phone });
    if (existingPhone) {
      return res.status(400).json({
        success: false,
        message: 'Phone number already registered'
      });
    }

    // Create user account (for unified system) - User model will hash password automatically
    const user = await userModel.create({
      username: username,
      name: name,
      contact: phone,
      password: password, // User model will hash this
      city: city,
      email: email || '',
      role: 'pandit'
    });

    // Create pandit profile - Pandit model will hash password automatically
    const pandit = await Pandit.create({
      username: username.toLowerCase(),
      password: password, // Pandit model will hash this
      name,
      contact: {
        phone,
        email: email || '',
        whatsapp: phone
      },
      location: {
        city,
        state
      },
      experience: experience || 0,
      specialization: specialization ? specialization.split(',').map(s => s.trim()) : [],
      languages: languages ? languages.split(',').map(l => l.trim()) : ['Hindi'],
      user: user._id,
      isActive: true,
      isVerified: false
    });

    // Generate token
    const token = jwt.sign(
      { 
        _id: user._id, 
        role: 'pandit',
        panditId: pandit._id 
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: '365d' }
    );

    // Set cookie
    const cookieOptions = {
      httpOnly: true,
      expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      sameSite: 'lax',
      secure: false
    };

    res.cookie('panditToken', token, cookieOptions);

    res.json({
      success: true,
      message: 'Pandit registered successfully! Admin will verify your profile.',
      token,
      pandit: {
        _id: pandit._id,
        username: pandit.username,
        name: pandit.name,
        phone: pandit.contact.phone,
        email: pandit.contact.email,
        city: pandit.location.city,
        state: pandit.location.state,
        isVerified: pandit.isVerified,
        averageRating: pandit.averageRating || 0,
        totalBookings: pandit.totalBookings || 0,
        experience: pandit.experience || 0,
        specialization: pandit.specialization || [],
        role: 'pandit'
      }
    });

  } catch (error) {
    console.error('Pandit registration error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Pandit Login
router.post('/login', async (req, res) => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide phone/username and password'
      });
    }

    // Find pandit by phone OR username
    const pandit = await Pandit.findOne({
      $or: [
        { 'contact.phone': phone },
        { username: phone.toLowerCase() }
      ]
    });

    if (!pandit) {
      return res.status(404).json({
        success: false,
        message: 'Pandit not found. Please register first.'
      });
    }

    // Check password - try Pandit model first, fallback to User model
    let isMatch = false;
    
    if (pandit.password) {
      // New system: Use Pandit model's comparePassword method
      isMatch = await pandit.comparePassword(password);
    } else if (pandit.user) {
      // Old system: Password stored in User model (fallback)
      const user = await userModel.findById(pandit.user);
      if (user && user.password) {
        isMatch = await user.comparePassword(password);
        
        // Migrate password to Pandit model for future logins
        pandit.password = password; // Will be hashed by pre-save hook
        if (!pandit.username) {
          pandit.username = user.username || user.contact;
        }
        await pandit.save();
      }
    }

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid password'
      });
    }

    // Generate token
    const token = jwt.sign(
      { 
        _id: pandit.user || pandit._id, 
        role: 'pandit',
        panditId: pandit._id 
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: '365d' }
    );

    // Set cookie
    const cookieOptions = {
      httpOnly: true,
      expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      sameSite: 'lax',
      secure: false
    };

    res.cookie('panditToken', token, cookieOptions);

    res.json({
      success: true,
      message: 'Login successful',
      token,
      pandit: {
        _id: pandit._id,
        username: pandit.username,
        name: pandit.name,
        phone: pandit.contact.phone,
        email: pandit.contact.email,
        city: pandit.location.city,
        state: pandit.location.state,
        photo: pandit.photo,
        experience: pandit.experience,
        specialization: pandit.specialization,
        averageRating: pandit.averageRating,
        totalBookings: pandit.totalBookings,
        isVerified: pandit.isVerified,
        isActive: pandit.isActive,
        role: 'pandit'
      }
    });

  } catch (error) {
    console.error('Pandit login error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get current pandit info (verify token)
router.get('/me', async (req, res) => {
  try {
    // Check token from cookie or Authorization header
    let token = req.cookies.panditToken;
    
    if (!token && req.headers.authorization) {
      token = req.headers.authorization.replace('Bearer ', '');
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    
    if (decoded.role !== 'pandit') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized as pandit'
      });
    }

    // Get pandit info
    const pandit = await Pandit.findById(decoded.panditId);
    
    if (!pandit) {
      return res.status(404).json({
        success: false,
        message: 'Pandit not found'
      });
    }

    res.json({
      success: true,
      pandit: {
        _id: pandit._id,
        name: pandit.name,
        phone: pandit.contact.phone,
        email: pandit.contact.email,
        city: pandit.location.city,
        state: pandit.location.state,
        photo: pandit.photo,
        experience: pandit.experience,
        specialization: pandit.specialization,
        averageRating: pandit.averageRating,
        totalBookings: pandit.totalBookings,
        isVerified: pandit.isVerified,
        isActive: pandit.isActive,
        role: 'pandit'
      }
    });

  } catch (error) {
    console.error('Get pandit info error:', error);
    res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
});

// Pandit Logout
router.post('/logout', (req, res) => {
  res.clearCookie('panditToken');
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
});

module.exports = router;
