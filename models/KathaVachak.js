// Katha Vachak Model Schema
const mongoose = require('mongoose');

// Live Katha Event Schema
const liveKathaSchema = new mongoose.Schema({
  addressLine1: String,
  addressLine2: String,
  city: String,
  state: String,
  country: {
    type: String,
    default: "India"
  },
  pincode: String,
  
  startDate: Date,
  endDate: Date,
  
  liveLink: String, // YouTube/Facebook live link
  kathaType: String, // e.g., "Bhagwat Katha", "Ramayan Katha", "Shiv Puran"
  
  isActive: {
    type: Boolean,
    default: true
  }
}, { _id: true, timestamps: true });

const kathaVachakSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  photo: {
    type: String,
    default: ''
  },
  photos: {
    type: [String],
    default: []
  },
  experience: {
    type: Number, // Years of experience
    default: 0
  },
  specialization: {
    type: String, // e.g., "Ramayan", "Bhagwat", "Shiv Puran"
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  contact: {
    phone: String,
    email: String,
    whatsapp: String
  },
  // MULTIPLE LIVE KATHA EVENTS (Future-ready)
  liveKathas: [liveKathaSchema],
  
  // SOCIAL MEDIA
  socialMedia: {
    facebook: String,
    instagram: String,
    youtube: String,
    twitter: String
  },
  // RATINGS & REVIEWS
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
  }
}, { timestamps: true });

// Helper method to check if any katha is currently live
kathaVachakSchema.methods.getCurrentLiveKatha = function() {
  const now = new Date();
  return this.liveKathas.find(katha => 
    katha.isActive && 
    katha.startDate <= now && 
    katha.endDate >= now
  );
};

// Helper method to get upcoming kathas
kathaVachakSchema.methods.getUpcomingKathas = function() {
  const now = new Date();
  return this.liveKathas.filter(katha => 
    katha.isActive && 
    katha.startDate > now
  ).sort((a, b) => a.startDate - b.startDate);
};

// Virtual field for isLive status
kathaVachakSchema.virtual('isLive').get(function() {
  return !!this.getCurrentLiveKatha();
});

// Ensure virtuals are included in JSON
kathaVachakSchema.set('toJSON', { virtuals: true });
kathaVachakSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('kathaVachak', kathaVachakSchema);
