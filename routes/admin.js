// Admin Routes
const express = require('express');
const router = express.Router();
const userModel = require('./users');
const blogModel = require('./blog');
const Mandir = require('../models/Mandir');
const KathaVachak = require('../models/KathaVachak');
const adminAuth = require('./middleware/adminAuth');

// All routes require admin authentication
router.use(adminAuth);

// ============================================
// DASHBOARD
// ============================================

// Get dashboard statistics
router.get('/dashboard', async (req, res) => {
  try {
    const totalUsers = await userModel.countDocuments();
    const totalBlogs = await blogModel.countDocuments();
    const pendingBlogs = await blogModel.countDocuments({ approved: false });
    const approvedBlogs = await blogModel.countDocuments({ approved: true });
    
    const totalRamNaam = await userModel.aggregate([
      { $group: { _id: null, total: { $sum: '$totalCount' } } }
    ]);

    // Get recent users (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentUsers = await userModel.countDocuments({ 
      joiningDate: { $gte: sevenDaysAgo } 
    });

    // Get recent blogs (last 7 days)
    const recentBlogs = await blogModel.countDocuments({ 
      createdAt: { $gte: sevenDaysAgo } 
    });

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalBlogs,
        pendingBlogs,
        approvedBlogs,
        totalRamNaam: totalRamNaam[0]?.total || 0,
        recentUsers,
        recentBlogs
      }
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// ============================================
// BLOG MANAGEMENT
// ============================================

// Get all pending blogs
router.get('/blogs/pending', async (req, res) => {
  try {
    const blogs = await blogModel.find({ approved: false })
      .populate('author', 'name username city')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      blogs
    });
  } catch (error) {
    console.error('Get pending blogs error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// Get all blogs (approved and pending)
router.get('/blogs', async (req, res) => {
  try {
    const { status } = req.query;
    let query = {};
    
    if (status === 'approved') {
      query.approved = true;
    } else if (status === 'pending') {
      query.approved = false;
    }

    const blogs = await blogModel.find(query)
      .populate('author', 'name username city')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      blogs
    });
  } catch (error) {
    console.error('Get blogs error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// Approve blog
router.post('/blogs/:id/approve', async (req, res) => {
  try {
    const blog = await blogModel.findByIdAndUpdate(
      req.params.id,
      { approved: true },
      { new: true }
    ).populate('author', 'name username');

    if (!blog) {
      return res.status(404).json({ 
        success: false, 
        message: 'Blog not found' 
      });
    }

    res.json({ 
      success: true, 
      message: 'Blog approved successfully',
      blog
    });
  } catch (error) {
    console.error('Approve blog error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// Reject blog (delete)
router.post('/blogs/:id/reject', async (req, res) => {
  try {
    const blog = await blogModel.findByIdAndDelete(req.params.id);

    if (!blog) {
      return res.status(404).json({ 
        success: false, 
        message: 'Blog not found' 
      });
    }

    res.json({ 
      success: true, 
      message: 'Blog rejected and deleted successfully' 
    });
  } catch (error) {
    console.error('Reject blog error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// Delete blog
router.delete('/blogs/:id', async (req, res) => {
  try {
    const blog = await blogModel.findByIdAndDelete(req.params.id);

    if (!blog) {
      return res.status(404).json({ 
        success: false, 
        message: 'Blog not found' 
      });
    }

    res.json({ 
      success: true, 
      message: 'Blog deleted successfully' 
    });
  } catch (error) {
    console.error('Delete blog error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// ============================================
// USER MANAGEMENT
// ============================================

// Get all users
router.get('/users', async (req, res) => {
  try {
    const { search, sortBy } = req.query;
    let query = {};
    let sort = { joiningDate: -1 }; // Default sort

    // Search functionality
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { username: { $regex: search, $options: 'i' } },
        { city: { $regex: search, $options: 'i' } }
      ];
    }

    // Sort functionality
    if (sortBy === 'totalCount') {
      sort = { totalCount: -1 };
    } else if (sortBy === 'rank') {
      sort = { rank: 1 };
    } else if (sortBy === 'name') {
      sort = { name: 1 };
    }

    const users = await userModel.find(query)
      .select('-password')
      .sort(sort);
    
    res.json({
      success: true,
      users
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// Get single user details
router.get('/users/:id', async (req, res) => {
  try {
    const user = await userModel.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    // Get user's blogs
    const blogs = await blogModel.find({ author: req.params.id })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      user,
      blogs
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// Update user role
router.post('/users/:id/role', async (req, res) => {
  try {
    const { role } = req.body;

    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid role' 
      });
    }

    const user = await userModel.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    res.json({ 
      success: true, 
      message: 'User role updated successfully',
      user
    });
  } catch (error) {
    console.error('Update role error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// ============================================
// MANDIR MANAGEMENT
// ============================================

// Get all mandirs
router.get('/mandirs', async (req, res) => {
  try {
    const mandirs = await Mandir.find()
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      mandirs
    });
  } catch (error) {
    console.error('Get mandirs error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// Create mandir
router.post('/mandirs', async (req, res) => {
  try {
    const mandirData = req.body;
    
    const mandir = await Mandir.create(mandirData);
    
    res.json({ 
      success: true, 
      message: 'Mandir created successfully',
      mandir
    });
  } catch (error) {
    console.error('Create mandir error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// Update mandir
router.put('/mandirs/:id', async (req, res) => {
  try {
    const mandir = await Mandir.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!mandir) {
      return res.status(404).json({ 
        success: false, 
        message: 'Mandir not found' 
      });
    }

    res.json({ 
      success: true, 
      message: 'Mandir updated successfully',
      mandir
    });
  } catch (error) {
    console.error('Update mandir error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// Delete mandir
router.delete('/mandirs/:id', async (req, res) => {
  try {
    const mandir = await Mandir.findByIdAndDelete(req.params.id);

    if (!mandir) {
      return res.status(404).json({ 
        success: false, 
        message: 'Mandir not found' 
      });
    }

    res.json({ 
      success: true, 
      message: 'Mandir deleted successfully' 
    });
  } catch (error) {
    console.error('Delete mandir error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// ============================================
// ANNOUNCEMENTS (Future Feature)
// ============================================

// Placeholder for announcements
router.get('/announcements', async (req, res) => {
  try {
    // TODO: Implement announcements model and logic
    res.json({
      success: true,
      announcements: [],
      message: 'Announcements feature coming soon'
    });
  } catch (error) {
    console.error('Get announcements error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

module.exports = router;


// ============================================
// KATHA VACHAK MANAGEMENT
// ============================================

// Get all katha vachaks
router.get('/katha-vachaks', async (req, res) => {
  try {
    const kathaVachaks = await KathaVachak.find()
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      kathaVachaks
    });
  } catch (error) {
    console.error('Get katha vachaks error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Create katha vachak
router.post('/katha-vachaks', async (req, res) => {
  try {
    const kathaVachakData = req.body;
    
    const kathaVachak = await KathaVachak.create(kathaVachakData);
    
    res.json({
      success: true,
      message: 'Katha Vachak created successfully',
      kathaVachak
    });
  } catch (error) {
    console.error('Create katha vachak error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Update katha vachak
router.put('/katha-vachaks/:id', async (req, res) => {
  try {
    const kathaVachak = await KathaVachak.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!kathaVachak) {
      return res.status(404).json({
        success: false,
        message: 'Katha Vachak not found'
      });
    }

    res.json({
      success: true,
      message: 'Katha Vachak updated successfully',
      kathaVachak
    });
  } catch (error) {
    console.error('Update katha vachak error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Delete katha vachak
router.delete('/katha-vachaks/:id', async (req, res) => {
  try {
    const kathaVachak = await KathaVachak.findByIdAndDelete(req.params.id);

    if (!kathaVachak) {
      return res.status(404).json({
        success: false,
        message: 'Katha Vachak not found'
      });
    }

    res.json({
      success: true,
      message: 'Katha Vachak deleted successfully'
    });
  } catch (error) {
    console.error('Delete katha vachak error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});
