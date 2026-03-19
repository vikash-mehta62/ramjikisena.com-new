const mongoose = require('mongoose');

const replySchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  text: { type: String, required: true, trim: true },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
  isAccepted: { type: Boolean, default: false },
}, { timestamps: true });

const forumPostSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  title: { type: String, required: true, trim: true, maxlength: 200 },
  body: { type: String, required: true, trim: true },
  category: {
    type: String,
    enum: ['Puja Help', 'Shastra Questions', 'Bhajan & Kirtan', 'Mandir Info', 'Festivals', 'General'],
    default: 'General'
  },
  tags: [{ type: String, trim: true, lowercase: true }],
  replies: [replySchema],
  views: { type: Number, default: 0 },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
  isSolved: { type: Boolean, default: false },
  isPinned: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

forumPostSchema.index({ category: 1, createdAt: -1 });
forumPostSchema.index({ title: 'text', body: 'text', tags: 'text' });

module.exports = mongoose.model('ForumPost', forumPostSchema);
