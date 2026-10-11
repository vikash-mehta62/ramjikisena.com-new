// Astrology Consultation Booking Model
const mongoose = require('mongoose');

const astrologyConsultationSchema = new mongoose.Schema({
  // Astrologer
  astrologer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'astrologer',
    required: true
  },

  // Client (User or Guest)
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  clientName: {
    type: String,
    required: true
  },
  clientPhone: {
    type: String,
    required: true
  },
  clientEmail: {
    type: String,
    lowercase: true,
    trim: true
  },

  // Consultation Details
  consultationType: {
    type: String,
    enum: ['Call', 'Video Call', 'Chat / WhatsApp', 'Kundli Report', 'Tarot Spread'],
    default: 'Call'
  },
  serviceTitle: {
    type: String,
    default: 'Personal Astrology Consultation'
  },
  fee: {
    type: Number,
    required: true
  },
  consultationDate: {
    type: Date,
    required: true
  },
  consultationTimeSlot: {
    type: String,
    required: true
  },

  // Astrology / Kundli Birth Chart Details (Optional for Tarot, Required for Kundli)
  birthDetails: {
    personName: String,
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other'],
      default: 'Male'
    },
    dob: String, // e.g. "1995-08-15"
    tob: String, // e.g. "10:30 AM"
    pob: String  // e.g. "Bhopal, MP"
  },

  // Specific Problem / Query Topic
  topic: {
    type: String,
    enum: [
      'Career & Job / नौकरी व व्यवसाय',
      'Marriage & Kundli Milan / विवाह व कुंडली मिलान',
      'Love & Relationship / प्रेम व संबंध',
      'Finance & Wealth / धन व व्यापार',
      'Health & Wellness / स्वास्थ्य व दीर्घायु',
      'Family & Children / संतान व परिवार',
      'Tarot 3-Card Guidance / टैरो कार्ड मार्गदर्शन',
      'General Life Guidance / सामान्य मार्गदर्शन'
    ],
    default: 'General Life Guidance / सामान्य मार्गदर्शन'
  },
  question: {
    type: String,
    default: ''
  },

  // Status & Notes
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'cod'],
    default: 'pending'
  },
  astrologerNotes: {
    type: String,
    default: ''
  },
  rejectionReason: String,
  meetingLink: String
}, { timestamps: true });

module.exports = mongoose.model('astrologyConsultation', astrologyConsultationSchema);
