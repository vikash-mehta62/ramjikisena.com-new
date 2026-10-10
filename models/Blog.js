const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  category: {
    type: String,
    default: 'Spiritual Knowledge',
    trim: true,
  },
  tags: [{
    type: String,
    trim: true,
  }],
  shortDescription: {
    type: String,
    trim: true,
  },
  content: {
    type: String,
    default: '',
  }, // Rich HTML from editor
  author: {
    type: String,
    default: 'श्री राम जी की सेना',
    trim: true,
  },
  authorUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    default: null,
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft',
  },
  approved: {
    type: Boolean,
    default: true,
  },
  readTime: {
    type: Number,
    default: 1, // minutes, auto-calculated
  },
  featuredImage: {
    type: String,
    default: null,
  },
  featuredImageAlt: {
    type: String,
    default: '',
    trim: true,
  },

  // Full SEO Suite
  seo: {
    focusKeyword:    { type: String, default: '', trim: true },
    metaTitle:       { type: String, default: '', trim: true },
    metaDescription: { type: String, default: '', trim: true },
    canonicalUrl:    { type: String, default: '', trim: true },
    ogTitle:         { type: String, default: '', trim: true },
    ogDescription:   { type: String, default: '', trim: true },
    ogImage:         { type: String, default: '', trim: true },
    noIndex:         { type: Boolean, default: false },
  },

  // Schema Markup Toggles
  schemaMarkup: {
    article:    { type: Boolean, default: true },
    faqPage:    { type: Boolean, default: false },
    breadcrumb: { type: Boolean, default: true },
  },

  // Dynamic FAQs
  faqs: [{
    question: { type: String, trim: true },
    answer:   { type: String, trim: true },
  }],

  // Engagement & Stats
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  }],
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
    },
    text: { type: String, trim: true },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  }],
  views: {
    type: Number,
    default: 0,
  },
  publishedAt: {
    type: Date,
    default: null,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    default: null,
  },
}, {
  timestamps: true,
});

// Auto-calculate read time (avg 200 words/minute) and publishedAt timestamp
blogSchema.pre('save', function (next) {
  if (this.isModified('content') && this.content) {
    const text = this.content.replace(/<[^>]+>/g, ' ');
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    this.readTime = Math.max(1, Math.ceil(words / 200));
  }
  if (this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  next();
});

// Performance & search indexes
blogSchema.index({ slug: 1 }, { unique: true });
blogSchema.index({ status: 1, publishedAt: -1 });
blogSchema.index({ category: 1, status: 1 });
blogSchema.index({ tags: 1 });
blogSchema.index({ approved: 1 });

module.exports = mongoose.models.Blog || mongoose.model('Blog', blogSchema);
