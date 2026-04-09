/* '/profile' page has been converted to '/' page and '/' page to '/login' page */

var express = require('express');
var router = express.Router();
const userModel = require('./users')
const blogModel = require('./blog')
const adminRouter = require('./admin')
const mandirRouter = require('./mandir')
const ExcelJS = require('exceljs');
require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// ============================================
// ADMIN API ROUTES
// ============================================

// Admin routes (requires admin authentication)
router.use('/api/admin', adminRouter);

// ============================================
// MANDIR API ROUTES
// ============================================

// Mandir routes
router.use('/api/mandirs', mandirRouter);

// ============================================
// API ROUTES FOR NEXT.JS (JSON RESPONSES)
// ============================================

// API Login (JSON response)
router.post('/api/login', async function (req, res) {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Username and password are required' 
      });
    }

    const userExist = await userModel.findOne({ username });
    if (!userExist) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }

    const isPasswordValid = await userExist.comparePassword(password);
    
    if (isPasswordValid) {
      const token = await userExist.generateToken();
      res.cookie('token', token, { 
        httpOnly: true,
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        sameSite: 'lax'
      });

      return res.json({ 
        success: true, 
        message: 'Login successful',
        user: {
          _id: userExist._id,
          username: userExist.username,
          name: userExist.name,
          city: userExist.city,
          role: userExist.role,
          rank: userExist.rank,
          totalCount: userExist.totalCount,
          mala: userExist.mala
        },
        redirect: userExist.role === 'admin' ? '/admin/admin-dashboard' : '/dashboard'
      });
    } else {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'An error occurred during login' 
    });
  }
});

// API Register (JSON response)
router.post('/api/register', async function (req, res) {
  try {
    const { username, name, city, password, contact } = req.body;

    if (!username || !name || !password || !contact) {
      return res.status(400).json({ 
        success: false, 
        message: 'All fields are required' 
      });
    }

    if (!/^([0-9]{10})$/.test(contact)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Contact number should be 10 digits' 
      });
    }

    const existingUserContact = await userModel.findOne({ contact });
    if (existingUserContact) {
      return res.status(400).json({ 
        success: false, 
        message: 'This contact already exists' 
      });
    }

    const existingUserUsername = await userModel.findOne({ username });
    if (existingUserUsername) {
      return res.status(400).json({ 
        success: false, 
        message: 'This username already exists' 
      });
    }

    const data = await userModel.create({ 
      username, 
      name, 
      city, 
      contact, 
      password 
    });

    const token = await data.generateToken();
    res.cookie('token', token, { 
      httpOnly: true,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      sameSite: 'lax'
    });

    return res.json({ 
      success: true, 
      message: 'Registration successful',
      user: {
        _id: data._id,
        username: data.username,
        name: data.name,
        city: data.city,
        role: data.role
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'An error occurred during registration' 
    });
  }
});

// API Get Current User (JSON response)
router.get('/api/me', isLoggedInAPI, async function (req, res) {
  try {
    const user = req.user;
    const loggedInUser = await userModel.findOne({ _id: user._id });
    
    if (!loggedInUser) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    return res.json({ 
      success: true,
      user: {
        _id: loggedInUser._id,
        username: loggedInUser.username,
        name: loggedInUser.name,
        city: loggedInUser.city,
        contact: loggedInUser.contact,
        rank: loggedInUser.rank,
        currCount: loggedInUser.currCount,
        totalCount: loggedInUser.totalCount,
        mala: loggedInUser.mala,
        role: loggedInUser.role,
        about: loggedInUser.about || '',
        dob: loggedInUser.dob || null,
        profileImage: loggedInUser.profileImage || null,
        coverImage: loggedInUser.coverImage || null,
        customJaapNames: loggedInUser.customJaapNames || [],
        dailyCounts: loggedInUser.dailyCounts
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'An error occurred' 
    });
  }
});

// API Save Count (JSON response)
router.post('/api/save', isLoggedInAPI, async function (req, res) {
  try {
    const user = req.user;
    const loggedInUser = await userModel.findOne({ _id: user._id });
    const { currentCount, totalCount, malaCount } = req.body;

    loggedInUser.totalCount += parseInt(currentCount);
    loggedInUser.mala = loggedInUser.totalCount !== 0 ? (loggedInUser.totalCount / 108).toFixed(2) : 0.00;
    loggedInUser.currCount = 0;

    const today = new Date();
    const hasEntryForToday = loggedInUser.dailyCounts &&
      loggedInUser.dailyCounts.length > 0 &&
      loggedInUser.dailyCounts[loggedInUser.dailyCounts.length - 1].date.toDateString() === today.toDateString();

    if (hasEntryForToday) {
      loggedInUser.dailyCounts[loggedInUser.dailyCounts.length - 1].count += parseInt(currentCount);
    } else {
      loggedInUser.dailyCounts.push({ date: today, count: parseInt(currentCount) });
    }

    await loggedInUser.save();

    return res.json({ 
      success: true, 
      message: 'Counts updated successfully',
      user: {
        totalCount: loggedInUser.totalCount,
        mala: loggedInUser.mala,
        currCount: loggedInUser.currCount
      }
    });
  } catch (error) {
    console.error('Save count error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'An error occurred while saving' 
    });
  }
});

// API Logout (JSON response)
router.get('/api/logout', (req, res) => {
  try {
    res.clearCookie('token');
    return res.json({ 
      success: true, 
      message: 'Logged out successfully' 
    });
  } catch (err) {
    console.error("Error during logout:", err);
    return res.status(500).json({ 
      success: false, 
      message: 'Logout failed' 
    });
  }
});

// API Forgot Password (JSON response)
router.post('/api/forgot', async function (req, res) {
  try {
    const { contact } = req.body;

    if (!contact) {
      return res.status(400).json({ 
        success: false, 
        message: 'Mobile number is required' 
      });
    }

    if (!/^[0-9]{10}$/.test(contact)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please enter a valid 10-digit mobile number' 
      });
    }

    const user = await userModel.findOne({ contact });

    if (user) {
      const token = await user.generateToken();
      
      // Try to set cookie (optional - if it fails, token is still in response)
      try {
        const isProduction = process.env.NODE_ENV === 'production';
        const cookieOptions = {
          httpOnly: true,
          expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          path: '/'
        };
        
        // Only add secure and sameSite in production
        if (isProduction) {
          cookieOptions.secure = true;
          cookieOptions.sameSite = 'none';
        }
        
        res.cookie('token', token, cookieOptions);
      } catch (cookieError) {
        console.log('Cookie setting failed (not critical):', cookieError.message);
      }

      // ALWAYS send token in response (main authentication method)
      return res.json({ 
        success: true, 
        message: 'Login successful',
        token: token, // Send token in response
        user: {
          _id: user._id,
          username: user.username,
          name: user.name,
          city: user.city,
          role: user.role
        },
        redirect: user.role === 'admin' ? '/admin/admin-dashboard' : '/dashboard'
      });
    } else {
      return res.status(404).json({ 
        success: false, 
        message: 'Mobile number not registered' 
      });
    }
  } catch (err) {
    console.error('Forgot password error:', err);
    return res.status(500).json({ 
      success: false, 
      message: 'An error occurred. Please try again later.' 
    });
  }
});

// API Get All Devotees (JSON response)
router.get('/api/devotees', isLoggedInAPI, async function (req, res) {
  try {
    const allUsers = await userModel.find().sort({ totalCount: -1 });
    
    return res.json({ 
      success: true,
      users: allUsers.map(user => ({
        _id: user._id,
        name: user.name,
        rank: user.rank,
        totalCount: user.totalCount,
        dailyCounts: user.dailyCounts,
        dob: user.dob || null
      }))
    });
  } catch (error) {
    console.error('Get devotees error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'An error occurred' 
    });
  }
});

// API Get Today's Birthdays
router.get('/api/birthdays', isLoggedInAPI, async function (req, res) {
  try {
    const today = new Date();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    // Match users whose dob month+day equals today
    const users = await userModel.find({
      dob: { $ne: null },
      $expr: {
        $and: [
          { $eq: [{ $month: '$dob' }, month] },
          { $eq: [{ $dayOfMonth: '$dob' }, day] }
        ]
      }
    }).select('_id name username dob');
    return res.json({ success: true, users });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'An error occurred' });
  }
});

// API Update Profile (JSON response)
router.post('/api/profile/update', isLoggedInAPI, async function (req, res) {
  try {
    const user = req.user;
    const { name, city, contact, about, dob, profileImage, coverImage } = req.body;

    const loggedInUser = await userModel.findById(req.user._id);
    if (!loggedInUser) return res.status(404).json({ success: false, message: 'User not found' });

    if (name) loggedInUser.name = name;
    if (city) loggedInUser.city = city;
    if (about !== undefined) loggedInUser.about = about.slice(0, 300);
    if (dob !== undefined) loggedInUser.dob = dob ? new Date(dob) : null;
    if (profileImage !== undefined) loggedInUser.profileImage = profileImage;
    if (coverImage !== undefined) loggedInUser.coverImage = coverImage;
    if (contact && /^[0-9]{10}$/.test(contact)) {
      // Check if contact already exists for another user
      const existingContact = await userModel.findOne({ 
        contact, 
        _id: { $ne: user._id } 
      });
      if (existingContact) {
        return res.status(400).json({ 
          success: false, 
          message: 'This contact number is already registered' 
        });
      }
      loggedInUser.contact = contact;
    }

    await loggedInUser.save();

    return res.json({ 
      success: true, 
      message: 'Profile updated successfully',
      user: {
        _id: loggedInUser._id,
        username: loggedInUser.username,
        name: loggedInUser.name,
        city: loggedInUser.city,
        contact: loggedInUser.contact
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'An error occurred while updating profile' 
    });
  }
});

// API Save Custom Jaap Name
router.post('/api/custom-jaap-names', isLoggedInAPI, async function (req, res) {
  try {
    const user = await userModel.findById(req.user._id);
    const { id, label, chars } = req.body;
    if (!label || !chars || !Array.isArray(chars) || chars.length === 0) {
      return res.status(400).json({ success: false, message: 'Invalid data' });
    }
    if (user.customJaapNames.length >= 10) {
      return res.status(400).json({ success: false, message: 'Maximum 10 custom names allowed' });
    }
    const newName = { id: id || Date.now().toString(), label: label.slice(0, 40), chars };
    user.customJaapNames.push(newName);
    await user.save();
    return res.json({ success: true, customJaapNames: user.customJaapNames });
  } catch (e) {
    return res.status(500).json({ success: false, message: 'Error saving' });
  }
});

// API Delete Custom Jaap Name
router.delete('/api/custom-jaap-names/:id', isLoggedInAPI, async function (req, res) {
  try {
    const user = await userModel.findById(req.user._id);
    user.customJaapNames = user.customJaapNames.filter(n => n.id !== req.params.id);
    await user.save();
    return res.json({ success: true, customJaapNames: user.customJaapNames });
  } catch (e) {
    return res.status(500).json({ success: false, message: 'Error deleting' });
  }
});

// ============================================
// BLOG API ROUTES
// ============================================

// Get all blogs (published & approved)
router.get('/api/blogs', async function (req, res) {
  try {
    const blogs = await blogModel.find({ published: true, approved: true })
      .populate('author', 'name username')
      .sort({ createdAt: -1 });
    
    return res.json({ 
      success: true,
      blogs: blogs
    });
  } catch (error) {
    console.error('Get blogs error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'An error occurred' 
    });
  }
});

// Get single blog
router.get('/api/blogs/:id', async function (req, res) {
  try {
    const blog = await blogModel.findById(req.params.id)
      .populate('author', 'name username')
      .populate('comments.user', 'name username');
    
    if (!blog) {
      return res.status(404).json({ 
        success: false, 
        message: 'Blog not found' 
      });
    }

    return res.json({ 
      success: true,
      blog: blog
    });
  } catch (error) {
    console.error('Get blog error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'An error occurred' 
    });
  }
});

// Create blog
router.post('/api/blogs/create', isLoggedInAPI, async function (req, res) {
  try {
    const user = req.user;
    const { title, content, category } = req.body;

    if (!title || !content) {
      return res.status(400).json({ 
        success: false, 
        message: 'Title and content are required' 
      });
    }

    const blog = await blogModel.create({
      author: user._id,
      title,
      content,
      category: category || 'Other',
      published: true,
      approved: false // Admin approval needed
    });

    return res.json({ 
      success: true, 
      message: 'Blog created successfully! Waiting for admin approval.',
      blog: blog
    });
  } catch (error) {
    console.error('Create blog error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'An error occurred while creating blog' 
    });
  }
});

// Like blog
router.post('/api/blogs/:id/like', isLoggedInAPI, async function (req, res) {
  try {
    const user = req.user;
    const blog = await blogModel.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ 
        success: false, 
        message: 'Blog not found' 
      });
    }

    const likeIndex = blog.likes.indexOf(user._id);
    
    if (likeIndex > -1) {
      // Unlike
      blog.likes.splice(likeIndex, 1);
    } else {
      // Like
      blog.likes.push(user._id);
    }

    await blog.save();

    return res.json({ 
      success: true, 
      liked: likeIndex === -1,
      likesCount: blog.likes.length
    });
  } catch (error) {
    console.error('Like blog error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'An error occurred' 
    });
  }
});

// Comment on blog
router.post('/api/blogs/:id/comment', isLoggedInAPI, async function (req, res) {
  try {
    const user = req.user;
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ 
        success: false, 
        message: 'Comment text is required' 
      });
    }

    const blog = await blogModel.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ 
        success: false, 
        message: 'Blog not found' 
      });
    }

    blog.comments.push({
      user: user._id,
      text: text
    });

    await blog.save();

    const updatedBlog = await blogModel.findById(req.params.id)
      .populate('comments.user', 'name username');

    return res.json({ 
      success: true, 
      message: 'Comment added successfully',
      comments: updatedBlog.comments
    });
  } catch (error) {
    console.error('Comment blog error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'An error occurred' 
    });
  }
});

// Get my blogs
router.get('/api/blogs/my/posts', isLoggedInAPI, async function (req, res) {
  try {
    const user = req.user;
    const blogs = await blogModel.find({ author: user._id })
      .sort({ createdAt: -1 });
    
    return res.json({ 
      success: true,
      blogs: blogs
    });
  } catch (error) {
    console.error('Get my blogs error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'An error occurred' 
    });
  }
});

// ============================================
// ORIGINAL ROUTES (EJS PAGES)
// ============================================


// Axios request to increment and save counts
router.post('/save', isLoggedIn, async function (req, res) {
  try {
    const user = req.user;
    const loggedInUser = await userModel.findOne({ _id: user._id });
    const { currentCount, totalCount, malaCount } = req.body;

    loggedInUser.totalCount += parseInt(currentCount);
    loggedInUser.mala = loggedInUser.totalCount !== 0 ? (loggedInUser.totalCount / 108).toFixed(2) : 0.00;
    loggedInUser.currCount = 0;

    // Update dailyCounts
    const today = new Date();

    const hasEntryForToday = loggedInUser.dailyCounts &&
      loggedInUser.dailyCounts.length > 0 &&
      loggedInUser.dailyCounts[loggedInUser.dailyCounts.length - 1].date.toDateString() === today.toDateString();

    if (hasEntryForToday) {
      loggedInUser.dailyCounts[loggedInUser.dailyCounts.length - 1].count += parseInt(currentCount);
    } else {
      loggedInUser.dailyCounts.push({ date: today, count: parseInt(currentCount) });
    }

    await loggedInUser.save();

    res.json({ message: 'Counts, Mala, and Daily Counts updated successfully' });
  } catch (error) {
    console.error('Error updating counts, Mala, and Daily Counts:', error);
    res.status(500).json({ error: 'An error occurred while updating counts, Mala, and Daily Counts' });
  }
});

// Profile page
router.get('/', isLoggedIn, async function (req, res, next) {
  try {
    // Update ranks
    const allUsers = await userModel.find({}, 'totalCount').sort({ totalCount: -1 });
    const bulkUpdateOps = allUsers.map((userDoc, index) => ({
      updateOne: {
        filter: { _id: userDoc._id },
        update: { rank: index + 1 }
      }
    }));
    await userModel.bulkWrite(bulkUpdateOps);

    const userCount = allUsers.length;
    const user = req.user;
    const loggedInUser = await userModel.findOne({ _id: user._id });
    res.render('index', { user: loggedInUser, userCount });
  } catch (error) {
    console.error('Error occurred while fetching data:', error);
    next(error);
  }
});

// static routes

router.get('/allDevotees', isLoggedIn, async function (req, res, next) {
  try {
    const user = req.user;
    const loggedInUser = await userModel.findOne({ _id: user._id });
    const allUsers = await userModel.find();
    res.render('allDevotees', { user: loggedInUser, allUsers });
  }
  catch (error) {
    console.error('Error occurred while fetching data:', error);
    next(error);
  }
});

router.get('/gallery', async function (req, res, next) {
  res.render('gallery');
});

router.get('/user/:name', isLoggedIn, async function (req, res) {
  try {
    const val = req.params.name;
    const users = await userModel.find({ name: new RegExp('^' + val, 'i') });
    res.json(users);
  }
  catch (error) {
    console.error('Error occurred while fetching data:', error);
    next(error);
  }
});

router.get('/lekhanHistory', isLoggedIn, async function (req, res) {
  try {
    const user = req.user;
    const loggedInUser = await userModel.findOne({ _id: user._id });
    res.render('lekhanHistory', { user: loggedInUser });
  }
  catch (error) {
    console.error('Error occurred while fetching data:', error);
    next(error);
  }
})

router.get('/impTemples', function (req, res) {
  res.render('impTemples');
})

router.get('/mission', function (req, res) {
  res.render('mission');
})

router.get('/about', function (req, res) {
  res.render('about');
})

router.get('/glory', function (req, res) {
  res.render('glory');
})

router.get('/feedback', function (req, res) {
  res.render('feedback');
})

router.get('/contact', function (req, res) {
  res.render('contact');
})

// Admin routes

router.get('/admin/allUsers', isAdmin, async (req, res) => {
  try {
    const users = await userModel.find().sort({ totalCount: -1 });
    res.render('admin/allUsers', { users });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/admin/admin-dashboard', isAdmin, async function (req, res) {
  try {
    const allUsers = await userModel.find();
    const userCount = allUsers.length;

    let totalRamnaamCount = allUsers.reduce((total, user) => total + user.totalCount, 0);

    res.render('admin/dashboard', { userCount, totalRamnaamCount });
  } catch (error) {
    console.error('Error occurred while fetching data:', error);
    next(error);
  }
});

router.get('/admin/downloadUsers', isAdmin, async (req, res) => {
  try {
    // Fetch all users from the database
    const users = await userModel.find();

    // Create a new workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Users');

    // Define worksheet headers
    worksheet.columns = [
      { header: 'Username', key: 'username', width: 20 },
      { header: 'Name', key: 'name', width: 20 },
      { header: 'City', key: 'city', width: 20 },
      { header: 'Total Count', key: 'totalCount', width: 15 },
      { header: 'Contact', key: 'contact', width: 15 }
      // Add more columns as needed
    ];

    // Populate worksheet with user data
    users.forEach(user => {
      worksheet.addRow({
        username: user.username,
        name: user.name,
        city: user.city,
        totalCount: user.totalCount,
        contact: user.contact
        // Add more fields as needed
      });
    });

    // Set response headers
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="users.xlsx"');

    // Serialize workbook to response
    await workbook.xlsx.write(res);

    // End response
    res.end();
  } catch (error) {
    console.error('Error downloading users:', error);
    res.status(500).send('Error downloading users');
  }
});


// Auth routes

router.get('/register', function (req, res, next) {
  res.render('register', { error: req.flash('error') });
});

router.post('/register', async function (req, res, next) {
  try {

    if (!req.body.username || !req.body.name || !req.body.password) {
      req.flash('error', 'All fields are required');
      return res.redirect('/register');
    }

    const { username, name, city, password, contact } = req.body;

    if (!/^([0-9]{10})$/.test(contact)) {
      req.flash('error', 'Contact number should be 10 digits');
      return res.redirect('/register');
    }

    const existingUserContact = await userModel.findOne({ contact });
    if (existingUserContact) {
      req.flash('error', 'This contact already exists');
      return res.redirect('/register');
    }

    const existingUserUsername = await userModel.findOne({ username });
    if (existingUserUsername) {
      req.flash('error', 'This username already exists');
      return res.redirect('/register');
    }

    const data = await userModel.create({ username, name, city, contact, password })

    const token = await data.generateToken();
    res.cookie('token', token, { 
      httpOnly: true,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
    }); // Set token as a cookie
    res.redirect('/'); // Redirect to / page
  }
  catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while registering the user' });
  };

});

router.get('/login', async function (req, res, next) {
  try {
    const allUsers = await userModel.find();
    const userCount = allUsers.length;

    const totalRamnaamCount = allUsers.reduce((total, user) => total + user.totalCount, 0);

    res.render('login', { userCount, totalRamnaamCount, error: req.flash('error') });
  } catch (error) {
    console.error('Error occurred while fetching data:', error);
    next(error);
  }
});

router.post('/login', async function (req, res, next) {
  try {
    const { username, password } = req.body;
    const userExist = await userModel.findOne({ username });
    if (!userExist) {
      req.flash('error', 'Invalid credentials');
      return res.redirect('/login');
    }

    const user = await userExist.comparePassword(password);
    // user contains true/false
    if (user) {
     
      const token = await userExist.generateToken();
      res.cookie('token', token, { 
        httpOnly: true,
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
      }); // Set token as a cookie

      if (userExist.role === 'admin') {
        res.redirect('/admin/admin-dashboard');
      } else {
        res.redirect('/');
      }

    } else {
      req.flash('error', 'Invalid credentials');
      return res.redirect('/login');
    }
  }
  catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while login' });
  };

});

router.get('/logout', (req, res) => {
  try {
    res.clearCookie('token');
    res.redirect('/login');
  } catch (err) {
    console.error("Error during logout:", err);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/forgot', function (req, res) {
  res.render('forgot', { error: req.flash('error') });
})

router.post('/forgot', async function (req, res, next) {
  try {
    const { contact } = req.body;
    const user = await userModel.findOne({ contact });

    if (user) {
      const token = await user.generateToken();
      res.cookie('token', token, { 
        httpOnly: true ,
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
      });
      if (user.role === 'admin') {
        return res.redirect('/admin/admin-dashboard');
      } else {
        return res.redirect('/');
      }
    }
    else {
      req.flash('error', 'Invalid phone number');
      return res.redirect('/forgot');
    }
  } catch (err) {
    console.error('Error:', err);
    req.flash('error', 'An error occurred. Please try again later.');
    return res.redirect('/forgot');
  }
});

function isLoggedIn(req, res, next) {
  const token = req.cookies.token;

  if (token == null) return res.redirect('/login');

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.redirect('/login');
      }
      return res.redirect('/login');
    }
    req.user = user;
    next();
  });
}

// API Middleware (returns JSON instead of redirect)
function isLoggedInAPI(req, res, next) {
  console.log('=== isLoggedInAPI Middleware Called ===');
  
  // Try to get token from cookie first
  let token = req.cookies.token;
  console.log('Token from cookie:', token ? 'FOUND' : 'NOT FOUND');
  
  // If not in cookie, check Authorization header
  if (!token) {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    console.log('Authorization header:', authHeader ? 'FOUND' : 'NOT FOUND');
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
      console.log('Token extracted from header:', token ? 'SUCCESS' : 'FAILED');
    }
  }

  if (!token) {
    console.log('❌ No token found - returning 401');
    return res.status(401).json({ 
      success: false, 
      message: 'Not authenticated',
      debug: {
        cookiePresent: !!req.cookies.token,
        authHeaderPresent: !!(req.headers.authorization || req.headers.Authorization)
      }
    });
  }

  console.log('Verifying token...');
  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
    if (err) {
      console.log('❌ Token verification failed:', err.message);
      return res.status(403).json({ 
        success: false, 
        message: 'Invalid token',
        error: err.message
      });
    }
    console.log('✅ Token verified for user:', user._id);
    req.user = user;
    next();
  });
}

async function isAdmin(req, res, next) {
  const token = req.cookies.token;

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, user) => {
    if (err) return res.sendStatus(403);
    const userRole = await userModel.findById(user._id);
    if (userRole.role != 'admin') {
      res.status(400).json({ success: false, message: "only admin is allowed" });
      res.redirect('/login');
    } else {
      req.user = user;
      next();
    }
  });
}
module.exports = router;
