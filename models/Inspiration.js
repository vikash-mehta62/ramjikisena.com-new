const mongoose = require('mongoose');

const inspirationSchema = new mongoose.Schema({
  chaupai: {
    type: String,
    required: true,
    trim: true,
  },
  bhavarth: {
    type: String,
    required: true,
    trim: true,
  },
  source: {
    type: String,
    default: 'श्री रामचरितमानस',
    trim: true,
  },
  active: {
    type: Boolean,
    default: true,
  },
  order: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Inspiration', inspirationSchema);
