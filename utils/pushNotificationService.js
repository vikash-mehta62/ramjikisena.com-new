const Device = require('../models/Device');
const Notification = require('../models/Notification');
const firebase = require('../config/firebase');

/**
 * Register or update a device token. Handles guest-to-user migration if userId is provided.
 */
const registerDevice = async ({ deviceId, fcmToken, platform, userId = null, role = 'guest' }) => {
  try {
    if (!deviceId || !fcmToken) {
      throw new Error('deviceId and fcmToken are required');
    }

    const updateData = {
      fcmToken,
      platform: platform || 'web'
    };

    if (userId) {
      updateData.userId = userId;
      updateData.role = role || 'user';
      updateData.isGuest = false;
    } else {
      updateData.userId = null;
      updateData.role = 'guest';
      updateData.isGuest = true;
    }

    const device = await Device.findOneAndUpdate(
      { deviceId },
      updateData,
      { new: true, upsert: true }
    );

    console.log(`[PUSH SERVICE] Device registered: ${deviceId} for userId: ${userId || 'guest'} (role: ${role})`);
    return device;
  } catch (error) {
    console.error('[PUSH SERVICE] Error registering device:', error.message);
    throw error;
  }
};

/**
 * Migrate guest device to logged in user on authentication
 */
const migrateGuestTokenToUser = async (userId, role, deviceId) => {
  try {
    if (!userId || !deviceId) return null;

    const device = await Device.findOneAndUpdate(
      { deviceId },
      {
        userId,
        role: role || 'user',
        isGuest: false
      },
      { new: true }
    );

    if (device) {
      console.log(`[PUSH SERVICE] Migrated guest device ${deviceId} to user ${userId} (${role})`);
    }
    return device;
  } catch (error) {
    console.error('[PUSH SERVICE] Error migrating guest device:', error.message);
    return null;
  }
};

/**
 * Reset device to guest state on logout
 */
const logoutDevice = async (deviceId) => {
  try {
    if (!deviceId) return null;

    const device = await Device.findOneAndUpdate(
      { deviceId },
      {
        userId: null,
        role: 'guest',
        isGuest: true
      },
      { new: true }
    );

    if (device) {
      console.log(`[PUSH SERVICE] Device ${deviceId} logged out (reset to guest)`);
    }
    return device;
  } catch (error) {
    console.error('[PUSH SERVICE] Error logging out device:', error.message);
    return null;
  }
};

/**
 * Create in-app notification in database
 */
const createInAppNotification = async ({ userId = null, role = '', isForGuest = false, title, body, imageUrl = '', type = 'system', data = {} }) => {
  try {
    const notification = await Notification.create({
      userId,
      role,
      isForGuest,
      title,
      body,
      imageUrl,
      type,
      data
    });
    return notification;
  } catch (error) {
    console.error('[PUSH SERVICE] Error creating in-app notification:', error.message);
    return null;
  }
};

/**
 * Send push notification to a specific user's active device tokens
 */
const sendPushToUser = async (userId, title, body, type = 'system', data = {}, imageUrl = '') => {
  try {
    if (!userId) return { success: false, reason: 'No userId provided' };

    await createInAppNotification({
      userId,
      title,
      body,
      imageUrl,
      type,
      data
    });

    const devices = await Device.find({ userId });
    const tokens = devices.map(d => d.fcmToken).filter(Boolean);

    if (tokens.length > 0) {
      return await firebase.sendToTokens(tokens, { title, body, imageUrl, data });
    } else {
      console.log(`[PUSH SERVICE] No active tokens found for user ${userId}`);
      return { success: false, reason: 'No active device tokens found for user' };
    }
  } catch (error) {
    console.error(`[PUSH SERVICE] Error sending push to user ${userId}:`, error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Send push notification to all users with a specific role (e.g. user, devotee, pandit, astrologer)
 */
const sendPushToRole = async (role, title, body, type = 'system', data = {}, imageUrl = '') => {
  try {
    await createInAppNotification({
      role,
      title,
      body,
      imageUrl,
      type,
      data
    });

    const query = role === 'user'
      ? { role: { $in: ['user', 'devotee'] } }
      : { role };

    const devices = await Device.find(query);
    const tokens = devices.map(d => d.fcmToken).filter(Boolean);

    if (tokens.length > 0) {
      return await firebase.sendToTokens(tokens, { title, body, imageUrl, data });
    } else {
      console.log(`[PUSH SERVICE] No active tokens found for role: ${role}`);
      return { success: false, reason: `No active tokens found for role: ${role}` };
    }
  } catch (error) {
    console.error(`[PUSH SERVICE] Error sending push to role ${role}:`, error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Send push to all registered devices (Both guests and users)
 */
const sendPushToAll = async (title, body, type = 'system', data = {}, imageUrl = '') => {
  try {
    await createInAppNotification({
      role: 'all',
      isForGuest: true,
      title,
      body,
      imageUrl,
      type,
      data
    });

    const devices = await Device.find({});
    const tokens = devices.map(d => d.fcmToken).filter(Boolean);

    if (tokens.length > 0) {
      return await firebase.sendToTokens(tokens, { title, body, imageUrl, data });
    } else {
      console.log('[PUSH SERVICE] No active device tokens found in system');
      return { success: false, reason: 'No tokens found in system' };
    }
  } catch (error) {
    console.error('[PUSH SERVICE] Error sending push to all:', error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Broadcast to a topic and sync in-app log
 */
const sendPushToTopic = async (topicSlug, title, body, data = {}, imageUrl = '') => {
  try {
    await createInAppNotification({
      role: `topic:${topicSlug}`,
      isForGuest: true,
      title,
      body,
      imageUrl,
      type: 'system',
      data
    });

    return await firebase.sendToTopic(topicSlug, { title, body, imageUrl, data });
  } catch (error) {
    console.error(`[PUSH SERVICE] Error sending push to topic ${topicSlug}:`, error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Subscribe devices of a list of users to a topic slug
 */
const subscribeUsersToTopic = async (userIds, topicSlug) => {
  try {
    const devices = await Device.find({ userId: { $in: userIds } });
    const tokens = devices.map(d => d.fcmToken).filter(Boolean);

    if (tokens.length > 0) {
      await firebase.subscribeToTopic(tokens, topicSlug);
      await Device.updateMany(
        { userId: { $in: userIds } },
        { $addToSet: { topics: topicSlug } }
      );
    }
    return { success: true };
  } catch (error) {
    console.error(`[PUSH SERVICE] Topic subscription error:`, error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Unsubscribe devices of a list of users from a topic slug
 */
const unsubscribeUsersFromTopic = async (userIds, topicSlug) => {
  try {
    const devices = await Device.find({ userId: { $in: userIds } });
    const tokens = devices.map(d => d.fcmToken).filter(Boolean);

    if (tokens.length > 0) {
      await firebase.unsubscribeFromTopic(tokens, topicSlug);
      await Device.updateMany(
        { userId: { $in: userIds } },
        { $pull: { topics: topicSlug } }
      );
    }
    return { success: true };
  } catch (error) {
    console.error(`[PUSH SERVICE] Topic unsubscription error:`, error.message);
    return { success: false, error: error.message };
  }
};

module.exports = {
  registerDevice,
  migrateGuestTokenToUser,
  logoutDevice,
  createInAppNotification,
  sendPushToUser,
  sendPushToRole,
  sendPushToAll,
  sendPushToTopic,
  subscribeUsersToTopic,
  unsubscribeUsersFromTopic
};
