// Katha Vachak Routes
const express = require('express');
const router = express.Router();
const KathaVachak = require('../models/KathaVachak');

// Get all Katha Vachaks (Public)
router.get('/', async (req, res) => {
  try {
    const { search, city, state, isLive } = req.query;
    
    let query = {};
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { specialization: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (city) {
      query['liveKatha.city'] = { $regex: city, $options: 'i' };
    }
    
    if (state) {
      query['liveKatha.state'] = { $regex: state, $options: 'i' };
    }
    
    if (isLive === 'true') {
      query.isLive = true;
    }
    
    const kathaVachaks = await KathaVachak.find(query)
      .sort({ isLive: -1, averageRating: -1, createdAt: -1 });
    
    res.json({
      success: true,
      kathaVachaks
    });
  } catch (error) {
    console.error('Get katha vachaks error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get single Katha Vachak by ID (Public)
router.get('/:id', async (req, res) => {
  try {
    const kathaVachak = await KathaVachak.findById(req.params.id)
      .populate('reviews.user', 'name username');
    
    if (!kathaVachak) {
      return res.status(404).json({
        success: false,
        message: 'Katha Vachak not found'
      });
    }
    
    res.json({
      success: true,
      kathaVachak
    });
  } catch (error) {
    console.error('Get katha vachak error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Add review (Requires login)
router.post('/:id/review', async (req, res) => {
  try {
    const { rating, text } = req.body;
    const kathaVachak = await KathaVachak.findById(req.params.id);
    
    if (!kathaVachak) {
      return res.status(404).json({
        success: false,
        message: 'Katha Vachak not found'
      });
    }
    
    // Add review
    kathaVachak.reviews.push({
      user: req.user._id,
      rating,
      text
    });
    
    // Calculate average rating
    const totalRating = kathaVachak.reviews.reduce((sum, review) => sum + review.rating, 0);
    kathaVachak.averageRating = totalRating / kathaVachak.reviews.length;
    
    await kathaVachak.save();
    
    res.json({
      success: true,
      message: 'Review added successfully'
    });
  } catch (error) {
    console.error('Add review error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
