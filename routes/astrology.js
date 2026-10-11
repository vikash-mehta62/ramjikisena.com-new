// Public Astrology & Tarot Reading Routes
const express = require('express');
const router = express.Router();
const Astrologer = require('../models/Astrologer');
const AstrologyConsultation = require('../models/AstrologyConsultation');

// GET /api/astrology - List all astrologers & tarot readers with filters
router.get('/', async (req, res) => {
  try {
    const { specialty, city, language, search, sortBy } = req.query;
    const query = { isActive: true };

    if (specialty && specialty !== 'all') {
      query.specialties = { $regex: new RegExp(specialty, 'i') };
    }

    if (city && city !== 'all') {
      query['location.city'] = { $regex: new RegExp(city, 'i') };
    }

    if (language && language !== 'all') {
      query.languages = { $regex: new RegExp(language, 'i') };
    }

    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { name: searchRegex },
        { tagline: searchRegex },
        { about: searchRegex },
        { 'location.city': searchRegex },
        { 'location.state': searchRegex },
        { specialties: searchRegex }
      ];
    }

    let sort = { averageRating: -1, totalConsultations: -1 };
    if (sortBy === 'fee_low') sort = { fee: 1 };
    else if (sortBy === 'fee_high') sort = { fee: -1 };
    else if (sortBy === 'experience') sort = { experience: -1 };

    const astrologers = await Astrologer.find(query).sort(sort).lean();

    res.json({
      success: true,
      count: astrologers.length,
      astrologers
    });
  } catch (error) {
    console.error('Error fetching astrologers:', error);
    res.status(500).json({ success: false, message: 'Server error fetching astrologers' });
  }
});

// GET /api/astrology/:id - Get single astrologer profile
router.get('/:id', async (req, res) => {
  try {
    const astrologer = await Astrologer.findById(req.params.id);
    if (!astrologer) {
      return res.status(404).json({ success: false, message: 'Astrologer not found' });
    }

    res.json({
      success: true,
      astrologer
    });
  } catch (error) {
    console.error('Error fetching astrologer details:', error);
    res.status(500).json({ success: false, message: 'Server error fetching astrologer details' });
  }
});

// POST /api/astrology/consultation - Book a consultation (Paramarsh)
router.post('/consultation', async (req, res) => {
  try {
    const {
      astrologerId,
      clientName,
      clientPhone,
      clientEmail,
      consultationType,
      serviceTitle,
      fee,
      consultationDate,
      consultationTimeSlot,
      birthDetails,
      topic,
      question,
      userId
    } = req.body;

    if (!astrologerId || !clientName || !clientPhone || !consultationDate || !consultationTimeSlot) {
      return res.status(400).json({
        success: false,
        message: 'Required fields missing: astrologer, name, phone, date, and time slot are required'
      });
    }

    const astrologer = await Astrologer.findById(astrologerId);
    if (!astrologer) {
      return res.status(404).json({ success: false, message: 'Astrologer not found' });
    }

    const consultation = await AstrologyConsultation.create({
      astrologer: astrologerId,
      user: userId || undefined,
      clientName,
      clientPhone,
      clientEmail: clientEmail || '',
      consultationType: consultationType || 'Call',
      serviceTitle: serviceTitle || 'Personal Astrology Consultation',
      fee: fee || astrologer.fee || 501,
      consultationDate: new Date(consultationDate),
      consultationTimeSlot,
      birthDetails: birthDetails || {},
      topic: topic || 'General Life Guidance / सामान्य मार्गदर्शन',
      question: question || '',
      status: 'pending'
    });

    // Update total count on astrologer
    await Astrologer.findByIdAndUpdate(astrologerId, {
      $inc: { totalConsultations: 1 }
    });

    res.status(201).json({
      success: true,
      message: 'परामर्श सफलतापूर्वक बुक किया गया! ज्योतिषी आपसे संपर्क करेंगे।',
      consultation
    });
  } catch (error) {
    console.error('Error booking astrology consultation:', error);
    res.status(500).json({ success: false, message: 'Server error creating consultation' });
  }
});

// POST /api/astrology/:id/review - Add client review for astrologer
router.post('/:id/review', async (req, res) => {
  try {
    const { userName, rating, comment, topic } = req.body;

    if (!userName || !rating || !comment) {
      return res.status(400).json({
        success: false,
        message: 'Name, rating (1-5), and review comment are required'
      });
    }

    const astrologer = await Astrologer.findById(req.params.id);
    if (!astrologer) {
      return res.status(404).json({ success: false, message: 'Astrologer not found' });
    }

    astrologer.reviews.push({
      userName,
      rating: Number(rating),
      comment,
      topic: topic || 'Consultation'
    });

    astrologer.calculateAverageRating();
    await astrologer.save();

    res.json({
      success: true,
      message: 'समीक्षा सफलतापूर्वक जोड़ी गई!',
      averageRating: astrologer.averageRating
    });
  } catch (error) {
    console.error('Error adding review:', error);
    res.status(500).json({ success: false, message: 'Server error adding review' });
  }
});

module.exports = router;
