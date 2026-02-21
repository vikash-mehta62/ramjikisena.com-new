// Blog Model Schema
const mongoose = require('mongoose');

const blogSchema = mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['Spiritual Knowledge', 'Mandir Stories', 'Pooja Guides', 'Personal Experience', 'Other'],
    default: 'Other'
  },
  coverImage: {
    type: String,
    default: ''
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  }],
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user'
    },
    text: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  published: {
    type: Boolean,
    default: false
  },
  approved: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('blog', blogSchema);
