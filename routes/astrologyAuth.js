// Astrologer & Tarot Reader Authentication Routes
const express = require('express');
const router = express.Router();
const Astrologer = require('../models/Astrologer');
const userModel = require('./users');
const jwt = require('jsonwebtoken');

// Helper to authenticate JWT
const authenticateAstrologerToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = (authHeader && authHeader.split(' ')[1]) || req.cookies?.astrologerToken;

  if (!token) {
    return res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET_KEY || 'ramjikisena_secret_key');
    req.astrologerAuth = verified;
    next();
  } catch (err) {
    res.status(403).json({ success: false, message: 'Invalid or expired token' });
  }
};

// POST /api/astrology-auth/register - Register new Astrologer / Card Reader
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
      specialties,
      languages,
      fee,
      about,
      tagline,
      qualifications
    } = req.body;

    if (!name || !phone || !password || !city || !state) {
      return res.status(400).json({
        success: false,
        message: 'Name, phone, password, city, and state are required'
      });
    }

    const cleanUsername = username ? username.trim().toLowerCase() : `astro_${phone.slice(-6)}`;

    // Check if phone already registered
    const existingPhone = await Astrologer.findOne({ 'contact.phone': phone });
    if (existingPhone) {
      return res.status(400).json({
        success: false,
        message: 'यह फोन नंबर पहले से पंजीकृत है (Phone number already registered)'
      });
    }

    // Check if username taken
    const existingUser = await Astrologer.findOne({ username: cleanUsername });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'यूजरनेम पहले से मौजूद है, कृपया दूसरा चुनें (Username already taken)'
      });
    }

    // Parse specialties and languages
    const specialtiesArray = Array.isArray(specialties)
      ? specialties
      : (specialties ? specialties.split(',').map(s => s.trim()).filter(Boolean) : ['Vedic Astrology']);

    const languagesArray = Array.isArray(languages)
      ? languages
      : (languages ? languages.split(',').map(l => l.trim()).filter(Boolean) : ['Hindi']);

    // Create Astrologer profile
    const astrologer = await Astrologer.create({
      name: name.trim(),
      username: cleanUsername,
      password, // Password hashed automatically by Mongoose pre-save hook
      tagline: tagline || 'Certified Astrologer & Tarot Card Reader',
      about: about || '',
      contact: {
        phone: phone.trim(),
        email: email ? email.trim() : '',
        whatsapp: phone.trim()
      },
      location: {
        city: city.trim(),
        state: state.trim()
      },
      experience: Number(experience) || 0,
      specialties: specialtiesArray,
      languages: languagesArray,
      qualifications: qualifications || 'Certified Practitioner',
      fee: Number(fee) || 501,
      isVerified: false,
      isActive: true,
      availabilityStatus: 'online'
    });

    // Generate JWT token
    const token = jwt.sign(
      {
        _id: astrologer._id,
        role: 'astrologer',
        astrologerId: astrologer._id,
        name: astrologer.name
      },
      process.env.JWT_SECRET_KEY || 'ramjikisena_secret_key',
      { expiresIn: '365d' }
    );

    // Set cookie
    res.cookie('astrologerToken', token, {
      httpOnly: true,
      expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production'
    });

    res.status(201).json({
      success: true,
      message: 'ज्योतिषी पंजीकरण सफल! (Astrologer registered successfully)',
      token,
      astrologer: {
        _id: astrologer._id,
        name: astrologer.name,
        username: astrologer.username,
        phone: astrologer.contact.phone,
        email: astrologer.contact.email,
        city: astrologer.location.city,
        state: astrologer.location.state,
        specialties: astrologer.specialties,
        fee: astrologer.fee,
        isVerified: astrologer.isVerified,
        role: 'astrologer'
      }
    });
  } catch (error) {
    console.error('Astrologer registration error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error during registration' });
  }
});

// POST /api/astrology-auth/login - Login for Astrologer
router.post('/login', async (req, res) => {
  try {
    const { identifier, phone, password } = req.body;
    const loginKey = (identifier || phone || '').trim();

    if (!loginKey || !password) {
      return res.status(400).json({
        success: false,
        message: 'Phone/username and password are required'
      });
    }

    // Find astrologer by phone or username
    const astrologer = await Astrologer.findOne({
      $or: [
        { 'contact.phone': loginKey },
        { username: loginKey.toLowerCase() }
      ]
    });

    if (!astrologer) {
      return res.status(404).json({
        success: false,
        message: 'खाता नहीं मिला (Astrologer account not found. Please register)'
      });
    }

    // Verify password
    const isMatch = await astrologer.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'गलत पासवर्ड (Invalid password)'
      });
    }

    // Generate JWT
    const token = jwt.sign(
      {
        _id: astrologer._id,
        role: 'astrologer',
        astrologerId: astrologer._id,
        name: astrologer.name
      },
      process.env.JWT_SECRET_KEY || 'ramjikisena_secret_key',
      { expiresIn: '365d' }
    );

    res.cookie('astrologerToken', token, {
      httpOnly: true,
      expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production'
    });

    res.json({
      success: true,
      message: 'लॉगिन सफल (Login successful)',
      token,
      astrologer: {
        _id: astrologer._id,
        name: astrologer.name,
        username: astrologer.username,
        photo: astrologer.photo,
        phone: astrologer.contact.phone,
        email: astrologer.contact.email,
        city: astrologer.location.city,
        state: astrologer.location.state,
        specialties: astrologer.specialties,
        fee: astrologer.fee,
        isVerified: astrologer.isVerified,
        availabilityStatus: astrologer.availabilityStatus,
        role: 'astrologer'
      }
    });
  } catch (error) {
    console.error('Astrologer login error:', error);
    res.status(500).json({ success: false, message: 'Server error during login' });
  }
});

// GET /api/astrology-auth/me - Get current logged-in astrologer profile
router.get('/me', authenticateAstrologerToken, async (req, res) => {
  try {
    const astrologer = await Astrologer.findById(req.astrologerAuth.astrologerId);
    if (!astrologer) {
      return res.status(404).json({ success: false, message: 'Profile not found' });
    }

    res.json({
      success: true,
      astrologer
    });
  } catch (error) {
    console.error('Error fetching astrologer profile:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
module.exports.authenticateAstrologerToken = authenticateAstrologerToken;
