// Mandir Routes
const express = require('express');
const router = express.Router();
const Mandir = require('../models/Mandir');
const jwt = require('jsonwebtoken');

// Middleware to check if user is logged in (for reviews)
function isLoggedInAPI(req, res, next) {
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

// Get all mandirs (only approved)
router.get('/', async (req, res) => {
  try {
    const { city, state, search } = req.query;

    const conditions = { $or: [{ status: 'approved' }, { status: { $exists: false } }] };
    if (city) conditions['location.city'] = { $regex: city, $options: 'i' };
    if (state) conditions['location.state'] = { $regex: state, $options: 'i' };
    if (search) conditions.name = { $regex: search, $options: 'i' };
    
    const mandirs = await Mandir.find(conditions)
      .select('-reviews')
      .sort({ averageRating: -1, createdAt: -1 });
    
    res.json({ success: true, mandirs });
  } catch (error) {
    console.error('Get mandirs error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get single mandir
router.get('/:id', async (req, res) => {
  try {
    const mandir = await Mandir.findById(req.params.id)
      .populate('reviews.user', 'name username');
    
    if (!mandir) {
      return res.status(404).json({ 
        success: false, 
        message: 'Mandir not found' 
      });
    }

    res.json({
      success: true,
      mandir
    });
  } catch (error) {
    console.error('Get mandir error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// Add review (requires auth)
router.post('/:id/review', isLoggedInAPI, async (req, res) => {
  try {
    const { rating, text } = req.body;
    
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ 
        success: false, 
        message: 'Rating must be between 1 and 5' 
      });
    }

    const mandir = await Mandir.findById(req.params.id);
    
    if (!mandir) {
      return res.status(404).json({ 
        success: false, 
        message: 'Mandir not found' 
      });
    }

    // Check if user already reviewed
    const existingReview = mandir.reviews.find(
      r => r.user.toString() === req.user._id.toString()
    );

    if (existingReview) {
      return res.status(400).json({ 
        success: false, 
        message: 'You have already reviewed this mandir' 
      });
    }

    // Add review
    mandir.reviews.push({
      user: req.user._id,
      rating,
      text: text || ''
    });
    
    // Update average rating
    const totalRating = mandir.reviews.reduce((sum, r) => sum + r.rating, 0);
    mandir.averageRating = totalRating / mandir.reviews.length;
    
    await mandir.save();
    
    res.json({ 
      success: true, 
      message: 'Review added successfully',
      averageRating: mandir.averageRating
    });
  } catch (error) {
    console.error('Add review error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// User: Submit a mandir listing (pending approval)
router.post('/submit', isLoggedInAPI, async (req, res) => {
  try {
    const mandirData = {
      ...req.body,
      status: 'pending',
      submittedBy: req.user._id,
    };
    const mandir = await Mandir.create(mandirData);
    res.json({
      success: true,
      message: 'मंदिर की जानकारी सबमिट हो गई। Admin approval के बाद यह दिखेगा।',
      mandir
    });
  } catch (error) {
    console.error('Submit mandir error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// User: Get own submitted mandirs
router.get('/my-submissions', isLoggedInAPI, async (req, res) => {
  try {
    const mandirs = await Mandir.find({ submittedBy: req.user._id })
      .select('-reviews')
      .sort({ createdAt: -1 });
    res.json({ success: true, mandirs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get nearby mandirs (GPS-based)
router.get('/nearby/search', async (req, res) => {
  try {
    const { lat, lng, radius = 50 } = req.query;
    
    if (!lat || !lng) {
      return res.status(400).json({ 
        success: false, 
        message: 'Latitude and longitude are required' 
      });
    }

    // Simple distance calculation (not perfect but works for demo)
    const mandirs = await Mandir.find({
      'location.coordinates.lat': { $exists: true },
      'location.coordinates.lng': { $exists: true }
    }).select('-reviews');

    // Calculate distance and filter
    const nearbyMandirs = mandirs.map(mandir => {
      const distance = calculateDistance(
        parseFloat(lat),
        parseFloat(lng),
        mandir.location.coordinates.lat,
        mandir.location.coordinates.lng
      );
      return { ...mandir.toObject(), distance };
    })
    .filter(m => m.distance <= radius)
    .sort((a, b) => a.distance - b.distance);

    res.json({
      success: true,
      mandirs: nearbyMandirs
    });
  } catch (error) {
    console.error('Nearby mandirs error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// Helper function to calculate distance between two coordinates (in km)
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return Math.round(distance * 10) / 10; // Round to 1 decimal
}

module.exports = router;
