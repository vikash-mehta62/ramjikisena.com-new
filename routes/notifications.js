const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Notification = require('../models/Notification');
const Device = require('../models/Device');
const NotificationTopic = require('../models/NotificationTopic');
const userModel = require('./users');
const pushService = require('../utils/pushNotificationService');
const adminAuth = require('./middleware/adminAuth');
const isLoggedInAPI = require('./middleware/isLoggedInAPI');

// ============================================
// PUBLIC DEVICE REGISTRATION ROUTES
// ============================================

// Register or update FCM device token (Public, optional token auth)
router.post('/register-device', async (req, res) => {
  try {
    const { deviceId, fcmToken, platform } = req.body;

    if (!deviceId || !fcmToken) {
      return res.status(400).json({ success: false, message: 'deviceId and fcmToken are required' });
    }

    let userId = null;
    let role = 'guest';

    // Check optional bearer token
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (authHeader && typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
      try {
        const token = authHeader.substring(7).trim();
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        if (decoded && decoded._id) {
          userId = decoded._id;
          const userDoc = await userModel.findById(decoded._id);
          if (userDoc) {
            role = userDoc.role || 'user';
          }
        }
      } catch (err) {
        // Token invalid, register as guest
      }
    }

    const device = await pushService.registerDevice({
      deviceId,
      fcmToken,
      platform: platform || 'web',
      userId,
      role
    });

    res.status(200).json({
      success: true,
      message: 'Device registered successfully',
      device
    });
  } catch (error) {
    console.error('Device registration error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Disassociate device token on logout
router.post('/device/logout', async (req, res) => {
  try {
    const { deviceId } = req.body;

    if (!deviceId) {
      return res.status(400).json({ success: false, message: 'deviceId is required' });
    }

    await pushService.logoutDevice(deviceId);

    res.status(200).json({
      success: true,
      message: 'Device logged out successfully (unlinked from user)'
    });
  } catch (error) {
    console.error('Device logout error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============================================
// USER IN-APP NOTIFICATIONS (PROTECTED)
// ============================================

// Get all notifications for logged in user
router.get('/', isLoggedInAPI, async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user._id })
      .sort({ isRead: 1, createdAt: -1 })
      .limit(50);

    const unreadCount = await Notification.countDocuments({ userId: req.user._id, isRead: false });

    res.json({
      success: true,
      notifications,
      unreadCount
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Mark all notifications as read
router.put('/read-all', isLoggedInAPI, async (req, res) => {
  try {
    await Notification.updateMany(
      { userId: req.user._id, isRead: false },
      { isRead: true }
    );

    res.json({
      success: true,
      message: 'All notifications marked as read'
    });
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Mark a specific notification as read
router.put('/:id/read', isLoggedInAPI, async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    res.json({
      success: true,
      notification
    });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============================================
// ADMIN PUSH NOTIFICATION ROUTES (adminAuth)
// ============================================

// Get dashboard metrics / counts for push targets
router.get('/admin/counts', adminAuth, async (req, res) => {
  try {
    const [totalDevices, devotees, pandits, astrologers, kathavachaks, guests, topicsCount] = await Promise.all([
      Device.countDocuments(),
      Device.countDocuments({ role: { $in: ['user', 'devotee', 'customer'] } }),
      Device.countDocuments({ role: 'pandit' }),
      Device.countDocuments({ role: 'astrologer' }),
      Device.countDocuments({ role: 'kathavachak' }),
      Device.countDocuments({ role: 'guest' }),
      NotificationTopic.countDocuments()
    ]);

    res.json({
      success: true,
      counts: {
        totalDevices,
        devotees,
        pandits,
        astrologers,
        kathavachaks,
        guests,
        topicsCount
      }
    });
  } catch (error) {
    console.error('Error fetching admin counts:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Send manual push notification to a target group/topic
router.post('/send-manual', adminAuth, async (req, res) => {
  try {
    const { targetType, targetTopic, title, body, link, imageUrl } = req.body;

    if (!title || !body || !targetType) {
      return res.status(400).json({ success: false, message: 'targetType, title and body are required' });
    }

    const payloadData = {
      ...(link && { link }),
      targetType
    };

    let result = { success: false, reason: 'Unknown target type' };

    if (targetType === 'all') {
      result = await pushService.sendPushToAll(title, body, 'manual', payloadData, imageUrl);
    } else if (['user', 'devotee', 'pandit', 'astrologer', 'kathavachak'].includes(targetType)) {
      result = await pushService.sendPushToRole(targetType, title, body, 'manual', payloadData, imageUrl);
    } else if (targetType === 'topic') {
      if (!targetTopic) {
        return res.status(400).json({ success: false, message: 'targetTopic slug is required when targetType is topic' });
      }
      result = await pushService.sendPushToTopic(targetTopic, title, body, payloadData, imageUrl);
    }

    // Save manual push notification log in DB history
    const logData = {
      targetType,
      targetTopic: targetType === 'topic' ? targetTopic : undefined,
      link,
      successCount: result.successCount || (result.success ? 1 : 0),
      failureCount: result.failureCount || 0
    };

    await Notification.create({
      title,
      body,
      imageUrl: imageUrl || '',
      type: 'manual',
      userId: null,
      role: 'admin',
      isForGuest: targetType === 'all',
      data: logData
    });

    const sent = result.success !== false;
    res.status(sent ? 200 : 400).json({
      success: sent,
      message: sent
        ? 'Push notification sent successfully'
        : (result.reason || result.error || 'Push notification could not be sent'),
      result
    });
  } catch (error) {
    console.error('Error sending manual notification:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get manual notification history logs
router.get('/manual-history', adminAuth, async (req, res) => {
  try {
    const history = await Notification.find({ type: 'manual' })
      .sort({ createdAt: -1 })
      .limit(100);

    res.json({
      success: true,
      history
    });
  } catch (error) {
    console.error('Error fetching manual history:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============================================
// TOPICS MANAGEMENT (ADMIN)
// ============================================

// Get all topics with subscriber counts
router.get('/topics', adminAuth, async (req, res) => {
  try {
    const topics = await NotificationTopic.find().sort({ createdAt: -1 });

    const topicsWithCounts = await Promise.all(
      topics.map(async (topic) => {
        const subscriberCount = await Device.countDocuments({ topics: topic.slug });
        return {
          ...topic.toObject(),
          subscriberCount
        };
      })
    );

    res.json({
      success: true,
      topics: topicsWithCounts
    });
  } catch (error) {
    console.error('Error fetching topics:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create a new topic
router.post('/topics', adminAuth, async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: 'Topic name is required' });
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const existingTopic = await NotificationTopic.findOne({ slug });
    if (existingTopic) {
      return res.status(400).json({ success: false, message: 'Topic already exists (name is too similar)' });
    }

    const topic = await NotificationTopic.create({
      name: name.trim(),
      slug,
      description: (description || '').trim()
    });

    res.status(201).json({
      success: true,
      message: 'Topic created successfully',
      topic
    });
  } catch (error) {
    console.error('Error creating topic:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete a topic
router.delete('/topics/:id', adminAuth, async (req, res) => {
  try {
    const topic = await NotificationTopic.findByIdAndDelete(req.params.id);

    if (!topic) {
      return res.status(404).json({ success: false, message: 'Topic not found' });
    }

    // Unsubscribe all devices locally from this topic
    await Device.updateMany(
      { topics: topic.slug },
      { $pull: { topics: topic.slug } }
    );

    res.json({
      success: true,
      message: 'Topic deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting topic:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get subscribers of a specific topic slug
router.get('/topics/:slug/subscribers', adminAuth, async (req, res) => {
  try {
    const { slug } = req.params;

    const subscribedDevices = await Device.find({ topics: slug })
      .populate('userId', 'name username email phone role')
      .sort({ updatedAt: -1 });

    const subscribedUserIds = subscribedDevices
      .map(d => d.userId?._id?.toString())
      .filter(Boolean);

    const availableUsers = await userModel.find({
      _id: { $nin: subscribedUserIds }
    })
      .select('name username email phone role')
      .limit(100)
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      subscribers: subscribedDevices,
      availableUsers
    });
  } catch (error) {
    console.error('Error fetching topic subscribers:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Subscribe users to topic
router.post('/topics/:slug/subscribe', adminAuth, async (req, res) => {
  try {
    const { slug } = req.params;
    const { userIds } = req.body;

    if (!Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({ success: false, message: 'userIds array is required' });
    }

    const result = await pushService.subscribeUsersToTopic(userIds, slug);

    res.json({
      success: result.success !== false,
      message: 'Users subscribed to topic successfully'
    });
  } catch (error) {
    console.error('Error subscribing users to topic:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Unsubscribe users from topic
router.post('/topics/:slug/unsubscribe', adminAuth, async (req, res) => {
  try {
    const { slug } = req.params;
    const { userIds } = req.body;

    if (!Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({ success: false, message: 'userIds array is required' });
    }

    const result = await pushService.unsubscribeUsersFromTopic(userIds, slug);

    res.json({
      success: result.success !== false,
      message: 'Users unsubscribed from topic successfully'
    });
  } catch (error) {
    console.error('Error unsubscribing users from topic:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
