// Booking Model Schema
const mongoose = require('mongoose');

const bookingSchema = mongoose.Schema({
  // User who made the booking
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  
  // Pandit who will perform the pooja
  pandit: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'pandit',
    required: true
  },
  
  // Booking Details
  poojaType: {
    type: String,
    required: true
  },
  poojaDate: {
    type: Date,
    required: true
  },
  poojaTime: {
    type: String,
    required: true
  },
  duration: String,
  
  // Location where pooja will be performed
  location: {
    address: {
      type: String,
      required: true
    },
    city: String,
    state: String,
    pincode: String,
    landmark: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  
  // Pricing
  price: {
    type: Number,
    required: true
  },
  platformFee: {
    type: Number,
    default: 0
  },
  totalAmount: {
    type: Number,
    required: true
  },
  
  // Additional Requirements
  requirements: {
    samagriNeeded: {
      type: Boolean,
      default: false
    },
    numberOfPeople: Number,
    specialInstructions: String,
    language: String
  },
  
  // Status
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'rejected', 'completed', 'cancelled'],
    default: 'pending'
  },
  
  // Payment
  payment: {
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending'
    },
    method: String, // 'online', 'cash'
    transactionId: String,
    paidAt: Date
  },
  
  // Communication
  userNotes: String,
  panditNotes: String,
  
  // Timestamps for status changes
  confirmedAt: Date,
  rejectedAt: Date,
  completedAt: Date,
  cancelledAt: Date,
  
  // Cancellation
  cancellationReason: String,
  cancelledBy: {
    type: String,
    enum: ['user', 'pandit', 'admin']
  },
  
  // Review
  isReviewed: {
    type: Boolean,
    default: false
  }
  
}, { timestamps: true });

// Index for faster queries
bookingSchema.index({ user: 1, createdAt: -1 });
bookingSchema.index({ pandit: 1, poojaDate: 1 });
bookingSchema.index({ status: 1 });

module.exports = mongoose.model('booking', bookingSchema);
