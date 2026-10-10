const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Blog = require('../models/Blog');
const adminAuth = require('./middleware/adminAuth');

// Permission checker middleware
const checkPermission = (perm) => (req, res, next) => {
  if (req.userDoc?.role === 'admin') return next();
  const permissions = Array.isArray(req.userDoc?.permissions) ? req.userDoc.permissions : [];
  if (permissions.includes(perm) || permissions.includes('*') || permissions.includes('all')) return next();
  return res.status(403).json({
    success: false,
    message: `Access denied. Requires '${perm}' permission.`,
  });
};

// User authentication middleware for community actions
function isLoggedInAPI(req, res, next) {
  let token = null;
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (authHeader && typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
    const candidate = authHeader.substring(7).trim();
    if (candidate && candidate !== 'null' && candidate !== 'undefined') {
      token = candidate;
    }
  }
  if (!token && req.cookies && req.cookies.token) {
    const cookieCandidate = String(req.cookies.token).trim();
    if (cookieCandidate && cookieCandidate !== 'null' && cookieCandidate !== 'undefined') {
      token = cookieCandidate;
    }
  }
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required. Please login.',
    });
  }

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired session. Please login again.',
      });
    }
    req.user = user;
    next();
  });
}

// Simple HTML sanitizer (strips malicious script, iframe, and inline event handlers)
function sanitizeHTML(html) {
  if (!html) return '';
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/\son\w+\s*=\s*["'][^"']*["']/gi, '')
    .replace(/javascript:/gi, '');
}

function slugify(text) {
  return (text || '')
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// ─────────────────────────────────────────────────────────────────────────────
// ADMIN ROUTES (Must come before /:slug)
// ─────────────────────────────────────────────────────────────────────────────

// GET all blogs for admin dashboard (all statuses with stats)
router.get('/admin/all', adminAuth, checkPermission('blogs'), async (req, res) => {
  try {
    const { status, search, page = 1, limit = 20 } = req.query;
    const query = {};

    if (status && status !== 'all') {
      if (status === 'pending') {
        query.approved = false;
      } else {
        query.status = status;
      }
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
        { 'seo.focusKeyword': { $regex: search, $options: 'i' } },
      ];
    }

    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 20));
    const skip = (pageNum - 1) * limitNum;

    const [blogs, total, allBlogs] = await Promise.all([
      Blog.find(query)
        .select('title slug category status readTime views publishedAt createdAt author tags featuredImage approved')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Blog.countDocuments(query),
      Blog.find({}, 'status views approved').lean(),
    ]);

    const stats = {
      total: allBlogs.length,
      published: allBlogs.filter((b) => b.status === 'published').length,
      draft: allBlogs.filter((b) => b.status === 'draft').length,
      archived: allBlogs.filter((b) => b.status === 'archived').length,
      pending: allBlogs.filter((b) => b.approved === false).length,
      views: allBlogs.reduce((acc, b) => acc + (b.views || 0), 0),
    };

    res.json({
      success: true,
      blogs,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum) || 1,
      stats,
    });
  } catch (error) {
    console.error('Admin get blogs error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET single blog by ID for admin editing
router.get('/admin/:id', adminAuth, checkPermission('blogs'), async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }
    res.json({ success: true, blog });
  } catch (error) {
    console.error('Admin get single blog error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST create blog (Admin)
router.post('/', adminAuth, checkPermission('blogs'), async (req, res) => {
  try {
    const { title, slug, content, ...rest } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, message: 'Blog title is required' });
    }

    const cleanTitle = title.trim();
    let cleanSlug = slug && slug.trim() ? slugify(slug) : slugify(cleanTitle);
    if (!cleanSlug) {
      cleanSlug = `blog-${Date.now()}`;
    }

    // Verify slug uniqueness
    const existing = await Blog.findOne({ slug: cleanSlug });
    if (existing) {
      cleanSlug = `${cleanSlug}-${Date.now().toString().slice(-4)}`;
    }

    const blog = await Blog.create({
      ...rest,
      title: cleanTitle,
      slug: cleanSlug,
      content: sanitizeHTML(content),
      createdBy: req.user?._id || null,
      author: rest.author || req.userDoc?.name || 'श्री राम जी की सेना',
    });

    res.status(201).json({
      success: true,
      message: 'Blog created successfully',
      blog,
    });
  } catch (error) {
    console.error('Create blog error:', error);
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'A blog with this slug already exists. Please choose a different slug.',
      });
    }
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT update blog by ID (Admin)
router.put('/:id', adminAuth, checkPermission('blogs'), async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }

    const { content, title, slug, ...rest } = req.body;

    if (title !== undefined) blog.title = title.trim();
    if (slug !== undefined && slug.trim()) blog.slug = slugify(slug);
    if (content !== undefined) blog.content = sanitizeHTML(content);

    const excludedKeys = ['_id', '__v', 'createdAt', 'updatedAt', 'createdBy', 'views', 'likes', 'comments', 'seo', 'schemaMarkup', 'faqs'];
    Object.keys(rest).forEach((key) => {
      if (!excludedKeys.includes(key)) {
        blog[key] = rest[key];
      }
    });

    if (rest.seo !== undefined) {
      blog.seo = rest.seo;
      blog.markModified('seo');
    }
    if (rest.schemaMarkup !== undefined) {
      blog.schemaMarkup = rest.schemaMarkup;
      blog.markModified('schemaMarkup');
    }
    if (rest.faqs !== undefined) {
      blog.faqs = rest.faqs;
      blog.markModified('faqs');
    }

    await blog.save(); // triggers pre('save') hook for readTime and publishedAt
    res.json({
      success: true,
      message: 'Blog updated successfully',
      blog,
    });
  } catch (error) {
    console.error('Update blog error:', error);
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'A blog with this slug already exists.',
      });
    }
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE blog (Admin)
router.delete('/:id', adminAuth, checkPermission('blogs'), async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }
    res.json({ success: true, message: 'Blog deleted successfully' });
  } catch (error) {
    console.error('Delete blog error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// PUBLIC ROUTES
// ─────────────────────────────────────────────────────────────────────────────

// GET distinct categories from published blogs
router.get('/categories', async (req, res) => {
  try {
    const categories = await Blog.distinct('category', { status: 'published' });
    const defaults = [
      'Spiritual Knowledge',
      'Mandir Stories',
      'Pooja Guides',
      'Katha & Satsang',
      'Festivals & Vrat',
      'Ram Katha',
      'Sanatan Dharma',
    ];
    const combined = Array.from(new Set([...categories.filter(Boolean), ...defaults])).sort();
    res.json({ success: true, categories: combined });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET sitemap data for published blogs
router.get('/sitemap', async (req, res) => {
  try {
    const blogs = await Blog.find({ status: 'published' })
      .select('slug publishedAt updatedAt')
      .sort({ publishedAt: -1 })
      .limit(500)
      .lean();
    res.json({ success: true, blogs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET all published blogs (Public)
router.get('/', async (req, res) => {
  try {
    const { category, tag, search, page = 1, limit = 9 } = req.query;
    const query = {
      $or: [
        { status: 'published' },
        { published: true, approved: true }, // backward compatibility
      ],
    };

    if (category && category !== 'all') {
      query.category = category;
    }
    if (tag) {
      query.tags = tag;
    }
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$and = [
        {
          $or: [
            { title: searchRegex },
            { shortDescription: searchRegex },
            { tags: { $in: [searchRegex] } },
          ],
        },
      ];
    }

    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.min(50, Math.max(1, parseInt(limit) || 9));
    const skip = (pageNum - 1) * limitNum;

    const [blogs, total] = await Promise.all([
      Blog.find(query)
        .select('title slug category tags shortDescription featuredImage featuredImageAlt author readTime publishedAt createdAt views likes')
        .sort({ publishedAt: -1, createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .populate('authorUser', 'name username profileImage')
        .lean(),
      Blog.countDocuments(query),
    ]);

    res.json({
      success: true,
      blogs,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum) || 1,
    });
  } catch (error) {
    console.error('Public get blogs error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Community / User submissions: My blogs
router.get('/my/posts', isLoggedInAPI, async (req, res) => {
  try {
    const blogs = await Blog.find({
      $or: [
        { createdBy: req.user._id },
        { authorUser: req.user._id },
      ],
    }).sort({ createdAt: -1 });

    res.json({ success: true, blogs });
  } catch (error) {
    console.error('Get my blogs error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Community / User submissions: Create user blog (requires admin approval)
router.post('/create', isLoggedInAPI, async (req, res) => {
  try {
    const { title, content, category } = req.body;
    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: 'Title and content are required',
      });
    }

    const cleanTitle = title.trim();
    let cleanSlug = slugify(cleanTitle);
    if (!cleanSlug) cleanSlug = `user-blog-${Date.now()}`;
    cleanSlug = `${cleanSlug}-${Date.now().toString().slice(-4)}`;

    const blog = await Blog.create({
      title: cleanTitle,
      slug: cleanSlug,
      content: sanitizeHTML(content),
      category: category || 'Spiritual Knowledge',
      author: req.user.name || req.user.username || 'भक्त',
      authorUser: req.user._id,
      createdBy: req.user._id,
      status: 'draft',
      approved: false, // requires admin approval
    });

    res.json({
      success: true,
      message: 'Blog submitted successfully! Waiting for admin approval.',
      blog,
    });
  } catch (error) {
    console.error('User create blog error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Like/Unlike blog
router.post('/:id/like', isLoggedInAPI, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }

    const userIdStr = req.user._id.toString();
    const index = blog.likes.findIndex((id) => id && id.toString() === userIdStr);

    if (index > -1) {
      blog.likes.splice(index, 1);
    } else {
      blog.likes.push(req.user._id);
    }

    await blog.save();
    res.json({
      success: true,
      liked: index === -1,
      likesCount: blog.likes.length,
    });
  } catch (error) {
    console.error('Like blog error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Comment on blog
router.post('/:id/comment', isLoggedInAPI, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ success: false, message: 'Comment cannot be empty' });
    }

    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }

    blog.comments.push({
      user: req.user._id,
      text: text.trim(),
      createdAt: new Date(),
    });

    await blog.save();
    const updated = await Blog.findById(req.params.id).populate('comments.user', 'name username profileImage');
    res.json({
      success: true,
      comments: updated.comments,
    });
  } catch (error) {
    console.error('Comment blog error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET single blog by slug (or fallback by ID)
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const reserved = ['admin', 'categories', 'sitemap', 'my'];
    if (reserved.includes(slug)) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }

    let query = { slug: slug.toLowerCase() };
    if (mongoose.Types.ObjectId.isValid(slug)) {
      query = {
        $or: [
          { slug: slug.toLowerCase() },
          { _id: slug },
        ],
      };
    }

    const blog = await Blog.findOne(query)
      .populate('authorUser', 'name username profileImage')
      .populate('comments.user', 'name username profileImage');

    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }

    // Increment views non-blockingly
    Blog.findByIdAndUpdate(blog._id, { $inc: { views: 1 } }).exec();

    res.json({ success: true, blog });
  } catch (error) {
    console.error('Get single blog error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
