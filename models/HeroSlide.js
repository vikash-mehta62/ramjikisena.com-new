const mongoose = require('mongoose');

const heroSlideSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    default: 'Jai Shree Ram'
  },
  subtitle: {
    type: String,
    default: 'Naam is the True Power'
  },
  tagline: {
    type: String,
    default: 'Chant. Connect. Learn. Live with Bhagwan Ram.'
  },
  description: {
    type: String,
    default: 'Join millions of devotees and experience peace, positivity and happiness through Ram Naam in your daily life.'
  },
  badge: {
    type: String,
    default: '🚩 Jai Shree Ram — Naam is the True Power'
  },
  image: {
    type: String,
    required: true,
    default: '/images/hero-ayodhya-ramji-hd.webp'
  },
  mobileImage: {
    type: String,
    default: ''
  },
  textAlignment: {
    type: String,
    enum: ['left', 'center', 'right'],
    default: 'center'
  },
  textColor: {
    type: String,
    default: '#2a1306'
  },
  showText: {
    type: Boolean,
    default: true
  },
  showButtons: {
    type: Boolean,
    default: true
  },
  button1Text: {
    type: String,
    default: 'Start Ram Naam Jaap'
  },
  button1Link: {
    type: String,
    default: '/#jaap'
  },
  button2Text: {
    type: String,
    default: 'Watch Video'
  },
  button2Link: {
    type: String,
    default: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
  },
  order: {
    type: Number,
    default: 1
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model('HeroSlide', heroSlideSchema);
