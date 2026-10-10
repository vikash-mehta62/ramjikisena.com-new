// Admin Routes
const express = require('express');
const router = express.Router();
const userModel = require('./users');
const blogModel = require('./blog');
const Mandir = require('../models/Mandir');
const KathaVachak = require('../models/KathaVachak');
const Pandit = require('../models/Pandit');
const Booking = require('../models/Booking');
const adminAuth = require('./middleware/adminAuth');
const adminSamagriRouter = require('./adminSamagri');

// All routes require admin authentication
router.use(adminAuth);

// Samagri admin routes
router.use('/samagri', adminSamagriRouter);

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
      { approved: true, status: 'published', publishedAt: new Date() },
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

// Get pending mandir submissions
router.get('/mandirs/pending', async (req, res) => {
  try {
    const mandirs = await Mandir.find({ status: 'pending' })
      .populate('submittedBy', 'name email username')
      .sort({ createdAt: -1 });
    res.json({ success: true, mandirs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Approve a mandir submission
router.put('/mandirs/:id/approve', async (req, res) => {
  try {
    const mandir = await Mandir.findByIdAndUpdate(
      req.params.id,
      { status: 'approved', rejectionReason: '' },
      { new: true }
    );
    if (!mandir) return res.status(404).json({ success: false, message: 'Mandir not found' });
    res.json({ success: true, message: 'Mandir approved successfully', mandir });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Reject a mandir submission
router.put('/mandirs/:id/reject', async (req, res) => {
  try {
    const { reason } = req.body;
    const mandir = await Mandir.findByIdAndUpdate(
      req.params.id,
      { status: 'rejected', rejectionReason: reason || '' },
      { new: true }
    );
    if (!mandir) return res.status(404).json({ success: false, message: 'Mandir not found' });
    res.json({ success: true, message: 'Mandir rejected', mandir });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
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

// ============================================
// PANDIT MANAGEMENT
// ============================================

// Get all pandits (with filters and stats)
router.get('/pandits', async (req, res) => {
  try {
    const { status, verified, search } = req.query;
    let query = {};

    if (status === 'active') query.isActive = true;
    if (status === 'inactive') query.isActive = false;

    if (verified === 'true') query.isVerified = true;
    if (verified === 'false') query.isVerified = false;

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { 'contact.phone': { $regex: search, $options: 'i' } },
        { 'location.city': { $regex: search, $options: 'i' } },
        { specialization: { $regex: search, $options: 'i' } }
      ];
    }

    const pandits = await Pandit.find(query).sort({ createdAt: -1 });

    const totalCount = await Pandit.countDocuments();
    const verifiedCount = await Pandit.countDocuments({ isVerified: true });
    const pendingCount = await Pandit.countDocuments({ isVerified: false });
    const activeCount = await Pandit.countDocuments({ isActive: true });

    res.json({
      success: true,
      pandits,
      stats: {
        total: totalCount,
        verified: verifiedCount,
        pending: pendingCount,
        active: activeCount
      }
    });
  } catch (error) {
    console.error('Admin get pandits error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get single pandit
router.get('/pandits/:id', async (req, res) => {
  try {
    const pandit = await Pandit.findById(req.params.id);
    if (!pandit) {
      return res.status(404).json({ success: false, message: 'Pandit not found' });
    }
    res.json({ success: true, pandit });
  } catch (error) {
    console.error('Admin get single pandit error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create new pandit (Admin direct create)
router.post('/pandits', async (req, res) => {
  try {
    const {
      name, username, phone, email, city, state, experience,
      specialization, languages, photo, about, isVerified, isActive
    } = req.body;

    if (!name || !phone || !city) {
      return res.status(400).json({ success: false, message: 'Name, phone and city are required' });
    }

    const panditData = {
      name,
      username: username ? username.toLowerCase() : phone,
      contact: { phone, email: email || '', whatsapp: phone },
      location: { city, state: state || 'Uttar Pradesh' },
      experience: Number(experience) || 0,
      specialization: Array.isArray(specialization) ? specialization : (specialization ? specialization.split(',').map(s => s.trim()) : []),
      languages: Array.isArray(languages) ? languages : (languages ? languages.split(',').map(l => l.trim()) : ['Hindi']),
      photo: photo || '',
      about: about || '',
      isVerified: isVerified !== undefined ? isVerified : true,
      isActive: isActive !== undefined ? isActive : true
    };

    const pandit = await Pandit.create(panditData);
    res.json({ success: true, message: 'Pandit created successfully', pandit });
  } catch (error) {
    console.error('Admin create pandit error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update pandit
router.put('/pandits/:id', async (req, res) => {
  try {
    const {
      name, phone, email, city, state, experience,
      specialization, languages, photo, about, isVerified, isActive
    } = req.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (phone) updateData['contact.phone'] = phone;
    if (email !== undefined) updateData['contact.email'] = email;
    if (city) updateData['location.city'] = city;
    if (state) updateData['location.state'] = state;
    if (experience !== undefined) updateData.experience = Number(experience);
    if (specialization) {
      updateData.specialization = Array.isArray(specialization) ? specialization : specialization.split(',').map(s => s.trim());
    }
    if (languages) {
      updateData.languages = Array.isArray(languages) ? languages : languages.split(',').map(l => l.trim());
    }
    if (photo !== undefined) updateData.photo = photo;
    if (about !== undefined) updateData.about = about;
    if (isVerified !== undefined) updateData.isVerified = isVerified;
    if (isActive !== undefined) updateData.isActive = isActive;

    const pandit = await Pandit.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!pandit) {
      return res.status(404).json({ success: false, message: 'Pandit not found' });
    }
    res.json({ success: true, message: 'Pandit updated successfully', pandit });
  } catch (error) {
    console.error('Admin update pandit error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Toggle pandit verification (Approve / Revoke)
router.put('/pandits/:id/verify', async (req, res) => {
  try {
    const pandit = await Pandit.findById(req.params.id);
    if (!pandit) {
      return res.status(404).json({ success: false, message: 'Pandit not found' });
    }
    pandit.isVerified = !pandit.isVerified;
    await pandit.save();
    res.json({
      success: true,
      message: pandit.isVerified ? 'पंडित जी को सत्यापित (Verify) कर दिया गया है' : 'पंडित सत्यापन वापस ले लिया गया है',
      isVerified: pandit.isVerified,
      pandit
    });
  } catch (error) {
    console.error('Admin toggle verify pandit error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Toggle pandit active status
router.put('/pandits/:id/status', async (req, res) => {
  try {
    const pandit = await Pandit.findById(req.params.id);
    if (!pandit) {
      return res.status(404).json({ success: false, message: 'Pandit not found' });
    }
    pandit.isActive = !pandit.isActive;
    await pandit.save();
    res.json({
      success: true,
      message: pandit.isActive ? 'पंडित जी को सक्रिय (Active) कर दिया गया है' : 'पंडित जी को निष्क्रिय (Inactive) कर दिया गया है',
      isActive: pandit.isActive,
      pandit
    });
  } catch (error) {
    console.error('Admin toggle status error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete pandit
router.delete('/pandits/:id', async (req, res) => {
  try {
    const pandit = await Pandit.findByIdAndDelete(req.params.id);
    if (!pandit) {
      return res.status(404).json({ success: false, message: 'Pandit not found' });
    }
    res.json({ success: true, message: 'पंडित जी का रिकॉर्ड हटा दिया गया है' });
  } catch (error) {
    console.error('Admin delete pandit error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============================================
// BOOKINGS MANAGEMENT
// ============================================

// Get all bookings
router.get('/bookings', async (req, res) => {
  try {
    const { status } = req.query;
    let query = {};
    if (status) query.status = status;

    const bookings = await Booking.find(query)
      .populate('user', 'name contact username email')
      .populate('pandit', 'name contact location photo')
      .sort({ createdAt: -1 });

    const totalCount = await Booking.countDocuments();
    const pendingCount = await Booking.countDocuments({ status: 'pending' });
    const confirmedCount = await Booking.countDocuments({ status: 'confirmed' });
    const completedCount = await Booking.countDocuments({ status: 'completed' });

    res.json({
      success: true,
      bookings,
      stats: {
        total: totalCount,
        pending: pendingCount,
        confirmed: confirmedCount,
        completed: completedCount
      }
    });
  } catch (error) {
    console.error('Admin get bookings error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update booking status
router.put('/bookings/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    res.json({ success: true, message: 'Booking status updated successfully', booking });
  } catch (error) {
    console.error('Admin update booking status error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============================================
// STAFF & SUBADMIN MANAGEMENT (SUPER ADMIN ONLY)
// ============================================

const superAdminOnly = (req, res, next) => {
  if (req.userDoc && req.userDoc.role === 'admin') {
    return next();
  }
  return res.status(403).json({
    success: false,
    message: 'Access denied: Only Super Admin can manage staff members and permissions'
  });
};

// Get all staff members
router.get('/staff', superAdminOnly, async (req, res) => {
  try {
    const staffList = await userModel.find({
      role: { $in: ['staff', 'subadmin'] }
    }).select('-password').sort({ createdAt: -1 });

    res.json({
      success: true,
      staff: staffList
    });
  } catch (error) {
    console.error('Admin get staff error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create new staff member
router.post('/staff', superAdminOnly, async (req, res) => {
  try {
    const { name, username, contact, password, permissions, city } = req.body;

    if (!name || !username || !contact || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, username, 10-digit mobile number, and password are required'
      });
    }

    if (!/^[0-9]{10}$/.test(contact)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid 10-digit mobile number'
      });
    }

    // Check if username or contact already exists
    const existingUsername = await userModel.findOne({ username: username.trim() });
    if (existingUsername) {
      return res.status(400).json({ success: false, message: 'Username is already taken' });
    }

    const existingContact = await userModel.findOne({ contact: contact.trim() });
    if (existingContact) {
      return res.status(400).json({ success: false, message: 'Mobile number is already registered' });
    }

    // Default permissions if empty
    const allowedPermissions = Array.isArray(permissions) ? permissions : [];

    const newStaff = await userModel.create({
      name: name.trim(),
      username: username.trim(),
      contact: contact.trim(),
      password: password, // Pre-save hook will hash this
      city: city ? city.trim() : 'Staff Office',
      role: 'staff',
      permissions: allowedPermissions
    });

    const sanitizedStaff = newStaff.toObject();
    delete sanitizedStaff.password;

    res.json({
      success: true,
      message: 'Staff member created successfully',
      staff: sanitizedStaff
    });
  } catch (error) {
    console.error('Admin create staff error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update staff member (including permissions)
router.put('/staff/:id', superAdminOnly, async (req, res) => {
  try {
    const { name, contact, password, permissions, city } = req.body;
    const staff = await userModel.findById(req.params.id);

    if (!staff || (staff.role !== 'staff' && staff.role !== 'subadmin')) {
      return res.status(404).json({ success: false, message: 'Staff member not found' });
    }

    if (name) staff.name = name.trim();
    if (city) staff.city = city.trim();
    if (contact) staff.contact = contact.trim();
    if (Array.isArray(permissions)) staff.permissions = permissions;
    if (password && password.trim().length >= 6) {
      staff.password = password.trim(); // Will be hashed by pre-save
    }

    await staff.save();

    const sanitized = staff.toObject();
    delete sanitized.password;

    res.json({
      success: true,
      message: 'Staff member updated successfully',
      staff: sanitized
    });
  } catch (error) {
    console.error('Admin update staff error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete staff member
router.delete('/staff/:id', superAdminOnly, async (req, res) => {
  try {
    const staff = await userModel.findOneAndDelete({
      _id: req.params.id,
      role: { $in: ['staff', 'subadmin'] }
    });

    if (!staff) {
      return res.status(404).json({ success: false, message: 'Staff member not found' });
    }

    res.json({
      success: true,
      message: 'Staff member deleted successfully'
    });
  } catch (error) {
    console.error('Admin delete staff error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
