// Poojan Samagri Order Model
const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'SamagriProduct' },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, default: 1 },
  image: { type: String, default: '' }
}, { _id: false });

const samagriOrderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },

  // Order type: package or custom cart
  orderType: { type: String, enum: ['package', 'custom'], default: 'custom' },
  package: { type: mongoose.Schema.Types.ObjectId, ref: 'SamagriPackage' },
  items: [orderItemSchema],

  // Pricing
  subtotal: { type: Number, required: true },
  deliveryCharge: { type: Number, default: 50 },
  totalAmount: { type: Number, required: true },

  // Delivery address
  deliveryAddress: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true }
  },

  // Pooja details
  poojaDate: { type: Date },
  poojaType: { type: String, default: '' },
  specialInstructions: { type: String, default: '' },

  // Status tracking
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'packed', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },

  // Payment
  payment: {
    status: { type: String, enum: ['pending', 'paid', 'failed', 'refunded'], default: 'pending' },
    method: { type: String, default: '' },
    transactionId: { type: String, default: '' }
  },

  // Tracking
  trackingInfo: {
    confirmedAt: Date,
    packedAt: Date,
    shippedAt: Date,
    deliveredAt: Date,
    cancelledAt: Date
  },

  cancellationReason: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('SamagriOrder', samagriOrderSchema);
