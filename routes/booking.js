// Booking Routes
const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Pandit = require('../models/Pandit');
const isLoggedInAPI = require('./middleware/isLoggedInAPI');

// Create booking (User must be logged in)
router.post('/', isLoggedInAPI, async (req, res) => {
  try {
    const bookingData = {
      ...req.body,
      user: req.user._id
    };
    
    // Calculate total amount
    bookingData.totalAmount = bookingData.price + (bookingData.platformFee || 0);
    
    const booking = await Booking.create(bookingData);
    
    // Update pandit stats
    await Pandit.findByIdAndUpdate(bookingData.pandit, {
      $inc: { totalBookings: 1 }
    });
    
    res.json({
      success: true,
      message: 'Booking created successfully',
      booking
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get user's bookings
router.get('/my-bookings', isLoggedInAPI, async (req, res) => {
  try {
    const { status } = req.query;
    
    let query = { user: req.user._id };
    if (status) query.status = status;
    
    const bookings = await Booking.find(query)
      .populate('pandit', 'name photo contact location averageRating')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      bookings
    });
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get single booking
router.get('/:id', isLoggedInAPI, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('pandit', 'name photo contact location')
      .populate('user', 'name contact');
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }
    
    // Check if user owns this booking
    if (booking.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized'
      });
    }
    
    res.json({
      success: true,
      booking
    });
  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Cancel booking (User)
router.post('/:id/cancel', isLoggedInAPI, async (req, res) => {
  try {
    const { cancellationReason } = req.body;
    
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }
    
    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized'
      });
    }
    
    if (booking.status === 'completed' || booking.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel this booking'
      });
    }
    
    booking.status = 'cancelled';
    booking.cancelledAt = new Date();
    booking.cancelledBy = 'user';
    booking.cancellationReason = cancellationReason;
    
    await booking.save();
    
    res.json({
      success: true,
      message: 'Booking cancelled successfully'
    });
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Add review
router.post('/:id/review', isLoggedInAPI, async (req, res) => {
  try {
    const { rating, text } = req.body;
    
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }
    
    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized'
      });
    }
    
    if (booking.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Can only review completed bookings'
      });
    }
    
    if (booking.isReviewed) {
      return res.status(400).json({
        success: false,
        message: 'Already reviewed'
      });
    }
    
    // Add review to pandit
    const pandit = await Pandit.findById(booking.pandit);
    pandit.reviews.push({
      user: req.user._id,
      booking: booking._id,
      rating,
      text
    });
    
    pandit.calculateAverageRating();
    await pandit.save();
    
    // Mark booking as reviewed
    booking.isReviewed = true;
    await booking.save();
    
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
