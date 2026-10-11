// Astrologer & Tarot Reader Model Schema
const mongoose = require('mongoose');

// Specific Consultation Offering Schema
const astrologyServiceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  duration: {
    type: String,
    default: '30 mins'
  },
  type: {
    type: String,
    enum: ['Call', 'Video Call', 'Chat / WhatsApp', 'Kundli Report', 'Tarot Spread'],
    default: 'Call'
  },
  description: String
}, { _id: true });

// Client Review Schema
const astrologyReviewSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true
  },
  topic: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { _id: true });

const astrologerSchema = new mongoose.Schema({
  // Authentication
  username: {
    type: String,
    unique: true,
    sparse: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String
  },

  // Basic Info
  name: {
    type: String,
    required: true,
    trim: true
  },
  tagline: {
    type: String,
    default: 'Certified Vedic Astrologer & Tarot Reader'
  },
  photo: {
    type: String,
    default: ''
  },
  photos: {
    type: [String],
    default: []
  },
  about: {
    type: String,
    default: ''
  },

  // Contact
  contact: {
    phone: {
      type: String,
      required: true,
      unique: true
    },
    email: {
      type: String,
      lowercase: true,
      trim: true
    },
    whatsapp: String
  },

  // Location
  location: {
    address: String,
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    pincode: String
  },

  // Professional Expertise
  experience: {
    type: Number,
    default: 0 // years
  },
  specialties: {
    type: [String], // e.g. ["Vedic Astrology", "Tarot Card Reading", "Kundli Milan", "Numerology", "Vastu", "Palmistry"]
    default: ['Vedic Astrology']
  },
  languages: {
    type: [String],
    default: ['Hindi']
  },
  qualifications: {
    type: String,
    default: 'Jyotish Acharya'
  },

  // Pricing & Services
  fee: {
    type: Number,
    default: 501 // Standard consultation fee
  },
  feePerMinute: {
    type: Number,
    default: 15
  },
  services: {
    type: [astrologyServiceSchema],
    default: []
  },

  // Reviews & Stats
  reviews: {
    type: [astrologyReviewSchema],
    default: []
  },
  averageRating: {
    type: Number,
    default: 5.0
  },
  totalConsultations: {
    type: Number,
    default: 0
  },

  // Account Status
  isVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  availabilityStatus: {
    type: String,
    enum: ['online', 'offline', 'busy'],
    default: 'online'
  },

  // User reference if unified
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  }
}, { timestamps: true });

// Password hashing middleware
astrologerSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) {
    return next();
  }
  try {
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash(this.password, 10);
    this.password = hashedPassword;
    next();
  } catch (error) {
    console.error('Error hashing astrologer password', error);
    next(error);
  }
});

// Method to compare passwords
astrologerSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    if (!this.password) return false;
    const bcrypt = require('bcryptjs');
    return bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    console.error('Error comparing astrologer password', error);
    return false;
  }
};

// Calculate average rating
astrologerSchema.methods.calculateAverageRating = function () {
  if (!this.reviews || this.reviews.length === 0) {
    this.averageRating = 5.0;
  } else {
    const sum = this.reviews.reduce((acc, r) => acc + r.rating, 0);
    this.averageRating = Number((sum / this.reviews.length).toFixed(1));
  }
  return this.averageRating;
};

module.exports = mongoose.model('astrologer', astrologerSchema);
