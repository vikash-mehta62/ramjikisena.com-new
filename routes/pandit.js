// Pandit Routes (Public)
const express = require('express');
const router = express.Router();
const Pandit = require('../models/Pandit');
const Booking = require('../models/Booking');

// Get all pandits (Public)
router.get('/', async (req, res) => {
  try {
    const { search, city, state, specialization, minRating } = req.query;
    
    let query = { isActive: true };
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { specialization: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (city) {
      query['location.city'] = { $regex: city, $options: 'i' };
    }
    
    if (state) {
      query['location.state'] = { $regex: state, $options: 'i' };
    }
    
    if (specialization) {
      query.specialization = { $in: [specialization] };
    }
    
    if (minRating) {
      query.averageRating = { $gte: parseFloat(minRating) };
    }
    
    const pandits = await Pandit.find(query)
      .select('-reviews') // Don't send all reviews in list
      .sort({ averageRating: -1, totalBookings: -1, createdAt: -1 });
    
    res.json({
      success: true,
      pandits
    });
  } catch (error) {
    console.error('Get pandits error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get single pandit by ID (Public)
router.get('/:id', async (req, res) => {
  try {
    const pandit = await Pandit.findById(req.params.id)
      .populate('reviews.user', 'name username');
    
    if (!pandit) {
      return res.status(404).json({
        success: false,
        message: 'Pandit not found'
      });
    }
    
    res.json({
      success: true,
      pandit
    });
  } catch (error) {
    console.error('Get pandit error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get pandit services
router.get('/:id/services', async (req, res) => {
  try {
    const pandit = await Pandit.findById(req.params.id).select('services');
    
    if (!pandit) {
      return res.status(404).json({
        success: false,
        message: 'Pandit not found'
      });
    }
    
    res.json({
      success: true,
      services: pandit.services
    });
  } catch (error) {
    console.error('Get services error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
