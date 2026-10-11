// Astrologer Portal Dashboard Routes
const express = require('express');
const router = express.Router();
const Astrologer = require('../models/Astrologer');
const AstrologyConsultation = require('../models/AstrologyConsultation');
const { authenticateAstrologerToken } = require('./astrologyAuth');

// Apply authentication middleware to all dashboard routes
router.use(authenticateAstrologerToken);

// GET /api/astrology-dashboard/stats - Summary metrics
router.get('/stats', async (req, res) => {
  try {
    const astrologerId = req.astrologerAuth.astrologerId;

    const [astrologer, totalBookings, pendingBookings, completedBookings] = await Promise.all([
      Astrologer.findById(astrologerId),
      AstrologyConsultation.countDocuments({ astrologer: astrologerId }),
      AstrologyConsultation.countDocuments({ astrologer: astrologerId, status: 'pending' }),
      AstrologyConsultation.countDocuments({ astrologer: astrologerId, status: 'completed' })
    ]);

    if (!astrologer) {
      return res.status(404).json({ success: false, message: 'Astrologer not found' });
    }

    const estimatedEarnings = completedBookings * (astrologer.fee || 501);

    res.json({
      success: true,
      stats: {
        totalConsultations: totalBookings,
        pendingConsultations: pendingBookings,
        completedConsultations: completedBookings,
        averageRating: astrologer.averageRating || 5.0,
        estimatedEarnings,
        availabilityStatus: astrologer.availabilityStatus || 'online',
        isVerified: astrologer.isVerified
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ success: false, message: 'Server error fetching stats' });
  }
});

// GET /api/astrology-dashboard/consultations - List all consultation requests
router.get('/consultations', async (req, res) => {
  try {
    const astrologerId = req.astrologerAuth.astrologerId;
    const { status } = req.query;

    const query = { astrologer: astrologerId };
    if (status && status !== 'all') {
      query.status = status;
    }

    const consultations = await AstrologyConsultation.find(query)
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      success: true,
      count: consultations.length,
      consultations
    });
  } catch (error) {
    console.error('Error fetching consultations:', error);
    res.status(500).json({ success: false, message: 'Server error fetching consultations' });
  }
});

// PUT /api/astrology-dashboard/consultations/:id - Update status (confirm, complete, cancel)
router.put('/consultations/:id', async (req, res) => {
  try {
    const astrologerId = req.astrologerAuth.astrologerId;
    const { status, astrologerNotes, meetingLink, rejectionReason } = req.body;

    const consultation = await AstrologyConsultation.findOne({
      _id: req.params.id,
      astrologer: astrologerId
    });

    if (!consultation) {
      return res.status(404).json({ success: false, message: 'Consultation request not found' });
    }

    if (status) consultation.status = status;
    if (astrologerNotes !== undefined) consultation.astrologerNotes = astrologerNotes;
    if (meetingLink !== undefined) consultation.meetingLink = meetingLink;
    if (rejectionReason !== undefined) consultation.rejectionReason = rejectionReason;

    await consultation.save();

    res.json({
      success: true,
      message: `परामर्श स्थिति अपडेट की गई: ${status}`,
      consultation
    });
  } catch (error) {
    console.error('Error updating consultation:', error);
    res.status(500).json({ success: false, message: 'Server error updating consultation' });
  }
});

// PUT /api/astrology-dashboard/profile - Update astrologer profile
router.put('/profile', async (req, res) => {
  try {
    const astrologerId = req.astrologerAuth.astrologerId;
    const {
      name,
      tagline,
      about,
      fee,
      feePerMinute,
      specialties,
      languages,
      availabilityStatus,
      city,
      state,
      photo
    } = req.body;

    const updateFields = {};
    if (name) updateFields.name = name.trim();
    if (tagline !== undefined) updateFields.tagline = tagline;
    if (about !== undefined) updateFields.about = about;
    if (fee !== undefined) updateFields.fee = Number(fee);
    if (feePerMinute !== undefined) updateFields.feePerMinute = Number(feePerMinute);
    if (availabilityStatus) updateFields.availabilityStatus = availabilityStatus;
    if (photo !== undefined) updateFields.photo = photo;

    if (city) updateFields['location.city'] = city.trim();
    if (state) updateFields['location.state'] = state.trim();

    if (specialties) {
      updateFields.specialties = Array.isArray(specialties)
        ? specialties
        : specialties.split(',').map(s => s.trim()).filter(Boolean);
    }

    if (languages) {
      updateFields.languages = Array.isArray(languages)
        ? languages
        : languages.split(',').map(l => l.trim()).filter(Boolean);
    }

    const updated = await Astrologer.findByIdAndUpdate(
      astrologerId,
      { $set: updateFields },
      { new: true }
    );

    res.json({
      success: true,
      message: 'प्रोफ़ाइल सफलतापूर्वक अपडेट की गई!',
      astrologer: updated
    });
  } catch (error) {
    console.error('Error updating astrologer profile:', error);
    res.status(500).json({ success: false, message: 'Server error updating profile' });
  }
});

module.exports = router;
