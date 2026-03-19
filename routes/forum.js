const express = require('express');
const router = express.Router();
const ForumPost = require('../models/ForumPost');
const isLoggedInAPI = require('./middleware/isLoggedInAPI');

const CATEGORIES = ['Puja Help', 'Shastra Questions', 'Bhajan & Kirtan', 'Mandir Info', 'Festivals', 'General'];

// GET /api/forum - list threads (paginated, filterable by category)
router.get('/', isLoggedInAPI, async (req, res) => {
  try {
    const { category, page = 1, limit = 15, search } = req.query;
    const query = { isActive: true };
    if (category && CATEGORIES.includes(category)) query.category = category;
    if (search) query.$text = { $search: search };

    const skip = (Number(page) - 1) * Number(limit);
    const [posts, total] = await Promise.all([
      ForumPost.find(query)
        .populate('author', 'name username profileImage')
        .select('title category tags views likes replies isSolved isPinned createdAt author')
        .sort({ isPinned: -1, createdAt: -1 })
        .skip(skip).limit(Number(limit)),
      ForumPost.countDocuments(query)
    ]);

    const userId = req.user._id.toString();
    const formatted = posts.map(p => ({
      _id: p._id, title: p.title, category: p.category, tags: p.tags,
      views: p.views, likesCount: p.likes.length, repliesCount: p.replies.length,
      isSolved: p.isSolved, isPinned: p.isPinned, createdAt: p.createdAt,
      author: p.author, isLiked: p.likes.map(l => l.toString()).includes(userId),
    }));

    res.json({ success: true, posts: formatted, total, hasMore: skip + posts.length < total });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/forum/:id - single thread with replies
router.get('/:id', isLoggedInAPI, async (req, res) => {
  try {
    const post = await ForumPost.findOneAndUpdate(
      { _id: req.params.id, isActive: true },
      { $inc: { views: 1 } },
      { new: true }
    ).populate('author', 'name username profileImage city')
     .populate('replies.author', 'name username profileImage');

    if (!post) return res.status(404).json({ success: false, message: 'Thread not found' });

    const userId = req.user._id.toString();
    res.json({
      success: true,
      post: {
        ...post.toObject(),
        isLiked: post.likes.map(l => l.toString()).includes(userId),
        replies: post.replies.map(r => ({
          ...r.toObject(),
          isLiked: r.likes.map(l => l.toString()).includes(userId),
        }))
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/forum - create thread
router.post('/', isLoggedInAPI, async (req, res) => {
  try {
    const { title, body, category, tags } = req.body;
    if (!title?.trim() || !body?.trim()) return res.status(400).json({ success: false, message: 'Title and body required' });

    const post = await ForumPost.create({
      author: req.user._id, title: title.trim(), body: body.trim(),
      category: CATEGORIES.includes(category) ? category : 'General',
      tags: Array.isArray(tags) ? tags.slice(0, 5) : [],
    });
    await post.populate('author', 'name username profileImage');
    res.status(201).json({ success: true, post });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/forum/:id/like - toggle like on thread
router.post('/:id/like', isLoggedInAPI, async (req, res) => {
  try {
    const post = await ForumPost.findOne({ _id: req.params.id, isActive: true });
    if (!post) return res.status(404).json({ success: false, message: 'Thread not found' });

    const uid = req.user._id;
    const liked = post.likes.includes(uid);
    liked ? post.likes.pull(uid) : post.likes.push(uid);
    await post.save();
    res.json({ success: true, liked: !liked, likesCount: post.likes.length });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/forum/:id/reply - add reply
router.post('/:id/reply', isLoggedInAPI, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text?.trim()) return res.status(400).json({ success: false, message: 'Reply text required' });

    const post = await ForumPost.findOne({ _id: req.params.id, isActive: true });
    if (!post) return res.status(404).json({ success: false, message: 'Thread not found' });

    post.replies.push({ author: req.user._id, text: text.trim() });
    await post.save();
    await post.populate('replies.author', 'name username profileImage');

    const newReply = post.replies[post.replies.length - 1];
    res.status(201).json({ success: true, reply: { ...newReply.toObject(), isLiked: false }, repliesCount: post.replies.length });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/forum/:id/reply/:replyId/like - toggle like on reply
router.post('/:id/reply/:replyId/like', isLoggedInAPI, async (req, res) => {
  try {
    const post = await ForumPost.findOne({ _id: req.params.id, isActive: true });
    if (!post) return res.status(404).json({ success: false, message: 'Thread not found' });

    const reply = post.replies.id(req.params.replyId);
    if (!reply) return res.status(404).json({ success: false, message: 'Reply not found' });

    const uid = req.user._id;
    const liked = reply.likes.includes(uid);
    liked ? reply.likes.pull(uid) : reply.likes.push(uid);
    await post.save();
    res.json({ success: true, liked: !liked, likesCount: reply.likes.length });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH /api/forum/:id/solve - mark thread as solved (author only)
router.patch('/:id/solve', isLoggedInAPI, async (req, res) => {
  try {
    const post = await ForumPost.findOne({ _id: req.params.id, author: req.user._id });
    if (!post) return res.status(404).json({ success: false, message: 'Thread not found or not authorized' });
    post.isSolved = !post.isSolved;
    await post.save();
    res.json({ success: true, isSolved: post.isSolved });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/forum/:id - delete thread (author only)
router.delete('/:id', isLoggedInAPI, async (req, res) => {
  try {
    const post = await ForumPost.findOneAndUpdate(
      { _id: req.params.id, author: req.user._id },
      { isActive: false }
    );
    if (!post) return res.status(404).json({ success: false, message: 'Thread not found or not authorized' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
