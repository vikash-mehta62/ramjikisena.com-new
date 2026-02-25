// Pandit Model Schema
const mongoose = require('mongoose');

// Service Schema
const serviceSchema = new mongoose.Schema({
  poojaType: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  duration: String, // e.g., "2 hours", "Half day"
  description: String
}, { _id: true });

const panditSchema = mongoose.Schema({
  // Authentication (Independent from User model)
  username: {
    type: String,
    unique: true,
    sparse: true, // Allows null/undefined values to be non-unique
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
  photo: {
    type: String,
    default: ''
  },
  photos: {
    type: [String],
    default: []
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
  
  // Professional Details
  experience: {
    type: Number,
    default: 0
  },
  specialization: {
    type: [String], // e.g., ["Vedic Rituals", "Marriage", "Griha Pravesh"]
    default: []
  },
  languages: {
    type: [String], // e.g., ["Hindi", "Sanskrit", "English"]
    default: []
  },
  qualification: String,
  
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
    pincode: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  
  // Services Offered
  services: [serviceSchema],
  
  // Availability
  availability: {
    workingDays: {
      type: [String], // ["Monday", "Tuesday", ...]
      default: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
    },
    workingHours: {
      start: String, // "09:00"
      end: String    // "18:00"
    }
  },
  
  // Description
  description: String,
  about: String,
  
  // Social Media
  socialMedia: {
    facebook: String,
    instagram: String,
    youtube: String,
    twitter: String
  },
  
  // Ratings & Reviews
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user'
    },
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'booking'
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
  
  // Stats
  totalBookings: {
    type: Number,
    default: 0
  },
  completedBookings: {
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
  
  // User Reference (if pandit has user account)
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  }
  
}, { timestamps: true });

// Password hashing middleware (same as User model)
panditSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  try {
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash(this.password, 10);
    this.password = hashedPassword;
    next();
  } catch (error) {
    console.error('Error hashing the password', error);
    next(error);
  }
});

// Method to compare passwords (same as User model)
panditSchema.methods.comparePassword = async function (password) {
  try {
    const bcrypt = require('bcryptjs');
    return bcrypt.compare(password, this.password);
  } catch (error) {
    console.error('Error comparing password', error);
    return false;
  }
};

// Calculate average rating
panditSchema.methods.calculateAverageRating = function() {
  if (this.reviews.length === 0) {
    this.averageRating = 0;
  } else {
    const sum = this.reviews.reduce((acc, review) => acc + review.rating, 0);
    this.averageRating = sum / this.reviews.length;
  }
  return this.averageRating;
};

module.exports = mongoose.model('pandit', panditSchema);
