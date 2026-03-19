// Community Feed Routes
const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const Follow = require('../models/Follow');
const userModel = require('./users');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// ── Auth Middleware ──────────────────────────────────────────────────────────
function isLoggedInAPI(req, res, next) {
  let token = req.cookies.token;
  if (!token) {
    const auth = req.headers.authorization || req.headers.Authorization;
    if (auth && auth.startsWith('Bearer ')) token = auth.substring(7);
  }
  if (!token) return res.status(401).json({ success: false, message: 'Not authenticated' });
  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ success: false, message: 'Invalid token' });
    req.user = user;
    next();
  });
}

// ── GET FEED ─────────────────────────────────────────────────────────────────
// Returns posts: all | city-filtered | following-only
router.get('/posts', isLoggedInAPI, async (req, res) => {
  try {
    const { city, category, filter = 'all', page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    let query = { isActive: true };

    if (city && city !== 'all') query.city = new RegExp(city, 'i');
    if (category && category !== 'all') query.category = category;

    if (filter === 'following') {
      const follows = await Follow.find({ follower: req.user._id }).select('following');
      const followingIds = follows.map(f => f.following);
      followingIds.push(req.user._id); // include own posts
      query.author = { $in: followingIds };
    }

    const [posts, total] = await Promise.all([
      Post.find(query)
        .populate('author', 'name username city profileImage')
        .populate('comments.user', 'name username profileImage')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Post.countDocuments(query)
    ]);

    // Add isLiked, isFollowing flags for current user
    const followingSet = new Set(
      (await Follow.find({ follower: req.user._id }).select('following'))
        .map(f => f.following.toString())
    );

    const enriched = posts.map(p => ({
      ...p.toObject(),
      isLiked: p.likes.some(id => id.toString() === req.user._id.toString()),
      isFollowing: followingSet.has(p.author._id.toString()),
      likesCount: p.likes.length,
      commentsCount: p.comments.length,
    }));

    res.json({ success: true, posts: enriched, total, page: Number(page), hasMore: skip + posts.length < total });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── CREATE POST ───────────────────────────────────────────────────────────────
router.post('/posts', isLoggedInAPI, async (req, res) => {
  try {
    const { text, images, category, city, state } = req.body;
    if (!text?.trim() && (!images || images.length === 0)) {
      return res.status(400).json({ success: false, message: 'Post cannot be empty' });
    }

    // Get user city if not provided
    let postCity = city;
    let postState = state;
    if (!postCity) {
      const user = await userModel.findById(req.user._id).select('city');
      postCity = user?.city || '';
    }

    const post = await Post.create({
      author: req.user._id,
      text: text?.trim() || '',
      images: images || [],
      category: category || 'General',
      city: postCity,
      state: postState || '',
    });

    const populated = await Post.findById(post._id)
      .populate('author', 'name username city profileImage');

    res.status(201).json({ success: true, post: { ...populated.toObject(), isLiked: false, isFollowing: false, likesCount: 0, commentsCount: 0 } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── DELETE POST ───────────────────────────────────────────────────────────────
router.delete('/posts/:id', isLoggedInAPI, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    await post.deleteOne();
    res.json({ success: true, message: 'Post deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── LIKE / UNLIKE ─────────────────────────────────────────────────────────────
router.post('/posts/:id/like', isLoggedInAPI, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });

    const idx = post.likes.findIndex(id => id.toString() === req.user._id.toString());
    if (idx > -1) {
      post.likes.splice(idx, 1);
    } else {
      post.likes.push(req.user._id);
    }
    await post.save();
    res.json({ success: true, liked: idx === -1, likesCount: post.likes.length });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── ADD COMMENT ───────────────────────────────────────────────────────────────
router.post('/posts/:id/comment', isLoggedInAPI, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text?.trim()) return res.status(400).json({ success: false, message: 'Comment cannot be empty' });

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });

    post.comments.push({ user: req.user._id, text: text.trim() });
    await post.save();

    const updated = await Post.findById(post._id).populate('comments.user', 'name username profileImage');
    const newComment = updated.comments[updated.comments.length - 1];
    res.json({ success: true, comment: newComment, commentsCount: updated.comments.length });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── DELETE COMMENT ────────────────────────────────────────────────────────────
router.delete('/posts/:id/comment/:commentId', isLoggedInAPI, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });

    const comment = post.comments.id(req.params.commentId);
    if (!comment) return res.status(404).json({ success: false, message: 'Comment not found' });
    if (comment.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    comment.deleteOne();
    await post.save();
    res.json({ success: true, commentsCount: post.comments.length });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── SHARE (increment counter) ─────────────────────────────────────────────────
router.post('/posts/:id/share', isLoggedInAPI, async (req, res) => {
  try {
    await Post.findByIdAndUpdate(req.params.id, { $inc: { sharesCount: 1 } });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── REPORT POST ───────────────────────────────────────────────────────────────
router.post('/posts/:id/report', isLoggedInAPI, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });
    if (!post.reportedBy.includes(req.user._id)) {
      post.reportedBy.push(req.user._id);
      await post.save();
    }
    res.json({ success: true, message: 'Post reported' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── FOLLOW / UNFOLLOW ─────────────────────────────────────────────────────────
router.post('/follow/:userId', isLoggedInAPI, async (req, res) => {
  try {
    if (req.params.userId === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'Cannot follow yourself' });
    }
    const existing = await Follow.findOne({ follower: req.user._id, following: req.params.userId });
    if (existing) {
      await existing.deleteOne();
      return res.json({ success: true, following: false });
    }
    await Follow.create({ follower: req.user._id, following: req.params.userId });
    res.json({ success: true, following: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── GET CITIES (for filter dropdown) ─────────────────────────────────────────
router.get('/cities', isLoggedInAPI, async (req, res) => {
  try {
    const cities = await Post.distinct('city', { isActive: true, city: { $ne: '' } });
    res.json({ success: true, cities: cities.sort() });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;

// ── PUBLIC USER PROFILE ───────────────────────────────────────────────────────
// GET /api/community/profile/:username
router.get('/profile/:username', isLoggedInAPI, async (req, res) => {
  try {
    const profileUser = await userModel.findOne({ username: req.params.username })
      .select('name username city profileImage totalCount mala rank joiningDate role');

    if (!profileUser) return res.status(404).json({ success: false, message: 'User not found' });

    const [followersCount, followingCount, postsCount, isFollowing] = await Promise.all([
      Follow.countDocuments({ following: profileUser._id }),
      Follow.countDocuments({ follower: profileUser._id }),
      Post.countDocuments({ author: profileUser._id, isActive: true }),
      Follow.findOne({ follower: req.user._id, following: profileUser._id }),
    ]);

    res.json({
      success: true,
      user: {
        ...profileUser.toObject(),
        followersCount,
        followingCount,
        postsCount,
        isFollowing: !!isFollowing,
        isOwnProfile: profileUser._id.toString() === req.user._id.toString(),
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/community/profile/:username/posts
router.get('/profile/:username/posts', isLoggedInAPI, async (req, res) => {
  try {
    const profileUser = await userModel.findOne({ username: req.params.username }).select('_id');
    if (!profileUser) return res.status(404).json({ success: false, message: 'User not found' });

    const { page = 1, limit = 12 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const [posts, total] = await Promise.all([
      Post.find({ author: profileUser._id, isActive: true })
        .populate('author', 'name username city profileImage')
        .populate('comments.user', 'name username profileImage')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Post.countDocuments({ author: profileUser._id, isActive: true }),
    ]);

    // Add isLiked flag
    const enriched = posts.map(p => ({
      ...p.toObject(),
      isLiked: p.likes.some(id => id.toString() === req.user._id.toString()),
      likesCount: p.likes.length,
      commentsCount: p.comments.length,
    }));

    res.json({ success: true, posts: enriched, total, hasMore: skip + posts.length < total });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/community/profile/:username/followers
router.get('/profile/:username/followers', isLoggedInAPI, async (req, res) => {
  try {
    const profileUser = await userModel.findOne({ username: req.params.username }).select('_id');
    if (!profileUser) return res.status(404).json({ success: false, message: 'User not found' });

    const followers = await Follow.find({ following: profileUser._id })
      .populate('follower', 'name username city profileImage totalCount rank')
      .sort({ createdAt: -1 });

    // Check which ones current user follows
    const myFollowing = new Set(
      (await Follow.find({ follower: req.user._id }).select('following'))
        .map(f => f.following.toString())
    );

    const list = followers.map(f => ({
      ...f.follower.toObject(),
      isFollowing: myFollowing.has(f.follower._id.toString()),
    }));

    res.json({ success: true, followers: list });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/community/profile/:username/following
router.get('/profile/:username/following', isLoggedInAPI, async (req, res) => {
  try {
    const profileUser = await userModel.findOne({ username: req.params.username }).select('_id');
    if (!profileUser) return res.status(404).json({ success: false, message: 'User not found' });

    const following = await Follow.find({ follower: profileUser._id })
      .populate('following', 'name username city profileImage totalCount rank')
      .sort({ createdAt: -1 });

    const myFollowing = new Set(
      (await Follow.find({ follower: req.user._id }).select('following'))
        .map(f => f.following.toString())
    );

    const list = following.map(f => ({
      ...f.following.toObject(),
      isFollowing: myFollowing.has(f.following._id.toString()),
    }));

    res.json({ success: true, following: list });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});
