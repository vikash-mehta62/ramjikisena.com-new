// Community Feed Post Model
const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  text: { type: String, required: true, trim: true },
  createdAt: { type: Date, default: Date.now }
}, { _id: true });

const postSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },

  // Content
  text: { type: String, trim: true, default: '' },
  images: [{ type: String }], // Cloudinary URLs

  // Category
  category: {
    type: String,
    enum: ['Pooja', 'Katha', 'Bhandara', 'Bhajan', 'Temple', 'General'],
    default: 'General'
  },

  // Location for city-based filtering
  city: { type: String, default: '', trim: true },
  state: { type: String, default: '', trim: true },

  // Engagement
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
  comments: [commentSchema],

  // Shares count (just a counter, no tracking needed)
  sharesCount: { type: Number, default: 0 },

  // Moderation
  isActive: { type: Boolean, default: true },
  reportedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],

}, { timestamps: true });

// Index for city-based filtering
postSchema.index({ city: 1, createdAt: -1 });
postSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Post', postSchema);
