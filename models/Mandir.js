// Mandir Model Schema
const mongoose = require('mongoose');

const mandirSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  history: {
    type: String,
    default: ''
  },
  photos: [{
    type: String,
    default: ''
  }],
  location: {
    address: String,
    city: String,
    state: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  timing: {
    opening: String,
    closing: String,
    aarti: [String]
  },
  contact: {
    phone: String,
    email: String,
    website: String
  },
  // NEW FIELDS
  deity: {
    main: String, // Main deity name
    others: [String] // Other deities
  },
  festivals: [{
    name: String,
    month: String,
    description: String
  }],
  facilities: {
    parking: { type: Boolean, default: false },
    prasad: { type: Boolean, default: false },
    accommodation: { type: Boolean, default: false },
    wheelchairAccessible: { type: Boolean, default: false },
    restrooms: { type: Boolean, default: false },
    drinkingWater: { type: Boolean, default: false }
  },
  visitInfo: {
    bestTimeToVisit: String, // e.g., "Morning 6-8 AM"
    dressCode: String, // e.g., "Traditional attire preferred"
    entryFee: String, // e.g., "Free" or "₹50"
    photographyAllowed: { type: Boolean, default: true }
  },
  nearbyAttractions: [{
    name: String,
    distance: String, // e.g., "2 km"
    type: String // e.g., "Temple", "Market", "Tourist Spot"
  }],
  socialMedia: {
    facebook: String,
    instagram: String,
    youtube: String,
    twitter: String
  },
  // EXISTING FIELDS
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user'
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    text: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  averageRating: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('mandir', mandirSchema);
