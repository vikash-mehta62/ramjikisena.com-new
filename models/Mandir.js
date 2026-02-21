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
