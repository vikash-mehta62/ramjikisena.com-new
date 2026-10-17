const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  serviceId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  category: {
    type: String,
    required: true,
    enum: ['purohit', 'satsang', 'darshan', 'samagri', 'blogs'],
    default: 'purohit',
  },
  title: {
    type: String,
    required: true,
    trim: true, // Hindi Title / Name
  },
  subtitle: {
    type: String,
    required: true,
    trim: true, // English Title / Name
  },
  desc: {
    type: String,
    trim: true,
    default: '',
  },
  href: {
    type: String,
    required: true,
    trim: true,
  },
  img: {
    type: String,
    required: true,
    trim: true,
  },
  imgPosition: {
    type: String,
    default: 'object-top',
    trim: true,
  },
  emoji: {
    type: String,
    default: '🔱',
    trim: true,
  },
  popular: {
    type: String,
    default: '',
    trim: true,
  },
  features: {
    type: [String],
    default: [],
  },
  ctaText: {
    type: String,
    default: 'प्रवेश करें',
    trim: true,
  },
  stats: {
    type: String,
    default: '',
    trim: true,
  },
  order: {
    type: Number,
    default: 0,
  },
  active: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Service', serviceSchema);
