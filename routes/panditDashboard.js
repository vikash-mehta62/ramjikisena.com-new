// Pandit Dashboard Routes
const express = require('express');
const router = express.Router();
const Pandit = require('../models/Pandit');
const Booking = require('../models/Booking');
const isLoggedInAPI = require('./middleware/isLoggedInAPI');

// Middleware to check if user is a pandit
const isPandit = async (req, res, next) => {
  try {
    const pandit = await Pandit.findOne({ user: req.user._id });
    if (!pandit) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized as pandit'
      });
    }
    req.pandit = pandit;
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// All routes require login and pandit status
router.use(isLoggedInAPI);
router.use(isPandit);

// Get pandit dashboard stats
router.get('/stats', async (req, res) => {
  try {
    const panditId = req.pandit._id;
    
    const totalBookings = await Booking.countDocuments({ pandit: panditId });
    const pendingBookings = await Booking.countDocuments({ pandit: panditId, status: 'pending' });
    const confirmedBookings = await Booking.countDocuments({ pandit: panditId, status: 'confirmed' });
    const completedBookings = await Booking.countDocuments({ pandit: panditId, status: 'completed' });
    
    // Calculate total earnings
    const earnings = await Booking.aggregate([
      { $match: { pandit: panditId, status: 'completed', 'payment.status': 'completed' } },
      { $group: { _id: null, total: { $sum: '$price' } } }
    ]);
    
    const totalEarnings = earnings[0]?.total || 0;
    
    // Get upcoming bookings
    const upcomingBookings = await Booking.find({
      pandit: panditId,
      status: { $in: ['pending', 'confirmed'] },
      poojaDate: { $gte: new Date() }
    })
    .populate('user', 'name contact')
    .sort({ poojaDate: 1 })
    .limit(5);
    
    res.json({
      success: true,
      stats: {
        totalBookings,
        pendingBookings,
        confirmedBookings,
        completedBookings,
        totalEarnings,
        averageRating: req.pandit.averageRating,
        totalReviews: req.pandit.reviews.length
      },
      upcomingBookings
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get all bookings for pandit
router.get('/bookings', async (req, res) => {
  try {
    const { status, date } = req.query;
    
    let query = { pandit: req.pandit._id };
    
    if (status) query.status = status;
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      query.poojaDate = { $gte: startDate, $lt: endDate };
    }
    
    const bookings = await Booking.find(query)
      .populate('user', 'name contact city')
      .sort({ poojaDate: -1, createdAt: -1 });
    
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

// Get single booking details
router.get('/bookings/:id', async (req, res) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      pandit: req.pandit._id
    }).populate('user', 'name contact city');
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
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

// Update booking status (unified endpoint)
router.patch('/bookings/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['confirmed', 'rejected', 'completed', 'cancelled'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be one of: confirmed, rejected, completed, cancelled'
      });
    }
    
    const booking = await Booking.findOne({
      _id: req.params.id,
      pandit: req.pandit._id
    });
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }
    
    // Validate status transitions
    if (status === 'confirmed' && booking.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Can only confirm pending bookings'
      });
    }
    
    if (status === 'rejected' && booking.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Can only reject pending bookings'
      });
    }
    
    if (status === 'completed' && booking.status !== 'confirmed') {
      return res.status(400).json({
        success: false,
        message: 'Can only complete confirmed bookings'
      });
    }
    
    // Update status
    booking.status = status;
    
    // Set timestamp based on status
    if (status === 'confirmed') {
      booking.confirmedAt = new Date();
    } else if (status === 'rejected') {
      booking.rejectedAt = new Date();
    } else if (status === 'completed') {
      booking.completedAt = new Date();
      
      // Update pandit stats
      const pandit = await Pandit.findById(req.pandit._id);
      if (pandit) {
        pandit.completedBookings = (pandit.completedBookings || 0) + 1;
        await pandit.save();
      }
    }
    
    await booking.save();
    
    res.json({
      success: true,
      message: `Booking ${status} successfully`,
      booking
    });
  } catch (error) {
    console.error('Update booking status error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Confirm booking
router.post('/bookings/:id/confirm', async (req, res) => {
  try {
    const { panditNotes } = req.body;
    
    const booking = await Booking.findOne({
      _id: req.params.id,
      pandit: req.pandit._id,
      status: 'pending'
    });
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found or already processed'
      });
    }
    
    booking.status = 'confirmed';
    booking.confirmedAt = new Date();
    if (panditNotes) booking.panditNotes = panditNotes;
    
    await booking.save();
    
    res.json({
      success: true,
      message: 'Booking confirmed successfully',
      booking
    });
  } catch (error) {
    console.error('Confirm booking error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Reject booking
router.post('/bookings/:id/reject', async (req, res) => {
  try {
    const { panditNotes } = req.body;
    
    const booking = await Booking.findOne({
      _id: req.params.id,
      pandit: req.pandit._id,
      status: 'pending'
    });
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found or already processed'
      });
    }
    
    booking.status = 'rejected';
    booking.rejectedAt = new Date();
    if (panditNotes) booking.panditNotes = panditNotes;
    
    await booking.save();
    
    res.json({
      success: true,
      message: 'Booking rejected',
      booking
    });
  } catch (error) {
    console.error('Reject booking error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Mark booking as completed
router.post('/bookings/:id/complete', async (req, res) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      pandit: req.pandit._id,
      status: 'confirmed'
    });
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found or not confirmed'
      });
    }
    
    booking.status = 'completed';
    booking.completedAt = new Date();
    
    await booking.save();
    
    // Update pandit completed bookings count
    await Pandit.findByIdAndUpdate(req.pandit._id, {
      $inc: { completedBookings: 1 }
    });
    
    res.json({
      success: true,
      message: 'Booking marked as completed',
      booking
    });
  } catch (error) {
    console.error('Complete booking error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get pandit profile
router.get('/profile', async (req, res) => {
  try {
    const pandit = await Pandit.findById(req.pandit._id);
    res.json({
      success: true,
      pandit
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Update pandit profile
router.put('/profile', async (req, res) => {
  try {
    const allowedUpdates = [
      'name', 'photo', 'photos', 'contact', 'experience', 
      'specialization', 'languages', 'qualification', 'location',
      'services', 'availability', 'description', 'about', 'socialMedia'
    ];
    
    const updates = {};
    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });
    
    const pandit = await Pandit.findByIdAndUpdate(
      req.pandit._id,
      updates,
      { new: true, runValidators: true }
    );
    
    // Sync important fields with User model
    const userModel = require('./users');
    const userUpdates = {};
    
    if (updates.name) userUpdates.name = updates.name;
    if (updates.contact?.phone) userUpdates.contact = updates.contact.phone;
    if (updates.location?.city) userUpdates.city = updates.location.city;
    
    if (Object.keys(userUpdates).length > 0 && req.user._id) {
      await userModel.findByIdAndUpdate(req.user._id, userUpdates);
    }
    
    res.json({
      success: true,
      message: 'Profile updated successfully',
      pandit
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Upload profile photo
router.post('/upload-photo', async (req, res) => {
  try {
    if (!req.files || !req.files.photo) {
      return res.status(400).json({
        success: false,
        message: 'No photo uploaded'
      });
    }

    const { cloudinary } = require('../lib/cloudinary');
    const photo = req.files.photo;

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(photo.tempFilePath, {
      folder: 'INEXT - RAM-JI-Ki-SENA/pandits',
      transformation: [
        { width: 500, height: 500, crop: 'fill', gravity: 'face' },
        { quality: 'auto' }
      ]
    });

    // Update pandit profile
    const pandit = await Pandit.findByIdAndUpdate(
      req.pandit._id,
      { photo: result.secure_url },
      { new: true }
    );

    res.json({
      success: true,
      message: 'Photo uploaded successfully',
      photo: result.secure_url,
      pandit
    });
  } catch (error) {
    console.error('Upload photo error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Upload multiple photos (gallery)
router.post('/upload-photos', async (req, res) => {
  try {
    if (!req.files || !req.files.photos) {
      return res.status(400).json({
        success: false,
        message: 'No photos uploaded'
      });
    }

    const { cloudinary } = require('../lib/cloudinary');
    const photos = Array.isArray(req.files.photos) ? req.files.photos : [req.files.photos];
    const uploadedUrls = [];

    // Upload each photo
    for (const photo of photos) {
      const result = await cloudinary.uploader.upload(photo.tempFilePath, {
        folder: 'INEXT - RAM-JI-Ki-SENA/pandits/gallery',
        transformation: [
          { width: 1200, height: 800, crop: 'limit' },
          { quality: 'auto' }
        ]
      });
      uploadedUrls.push(result.secure_url);
    }

    // Add to pandit photos array
    const pandit = await Pandit.findByIdAndUpdate(
      req.pandit._id,
      { $push: { photos: { $each: uploadedUrls } } },
      { new: true }
    );

    res.json({
      success: true,
      message: `${uploadedUrls.length} photos uploaded successfully`,
      photos: uploadedUrls,
      pandit
    });
  } catch (error) {
    console.error('Upload photos error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Delete photo from gallery
router.delete('/photos/:index', async (req, res) => {
  try {
    const photoIndex = parseInt(req.params.index);
    const pandit = await Pandit.findById(req.pandit._id);

    if (!pandit.photos[photoIndex]) {
      return res.status(404).json({
        success: false,
        message: 'Photo not found'
      });
    }

    // Remove from array
    pandit.photos.splice(photoIndex, 1);
    await pandit.save();

    res.json({
      success: true,
      message: 'Photo deleted successfully',
      pandit
    });
  } catch (error) {
    console.error('Delete photo error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get earnings report
router.get('/earnings', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    let query = {
      pandit: req.pandit._id,
      status: 'completed',
      'payment.status': 'completed'
    };
    
    if (startDate && endDate) {
      query.completedAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    
    const bookings = await Booking.find(query)
      .populate('user', 'name')
      .sort({ completedAt: -1 });
    
    const totalEarnings = bookings.reduce((sum, booking) => sum + booking.price, 0);
    
    res.json({
      success: true,
      totalEarnings,
      bookings
    });
  } catch (error) {
    console.error('Get earnings error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
