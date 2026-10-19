const mongoose = require("mongoose");

const deviceSchema = new mongoose.Schema({
  deviceId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  fcmToken: {
    type: String,
    required: true
  }, // 🔔 FCM device token
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
    index: true
  },
  role: {
    type: String,
    enum: ['user', 'devotee', 'pandit', 'astrologer', 'kathavachak', 'staff', 'admin', 'guest'],
    default: 'guest',
    index: true
  },
  isGuest: {
    type: Boolean,
    default: true,
    index: true
  },
  platform: {
    type: String,
    default: "web"
  },
  topics: {
    type: [String],
    default: []
  }
}, { timestamps: true });

module.exports = mongoose.model("Device", deviceSchema);
