// Poojan Samagri Package Model
const mongoose = require('mongoose');

const packageItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'SamagriProduct', required: true },
  quantity: { type: Number, required: true, default: 1 }
}, { _id: false });

const samagriPackageSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  tier: {
    type: String,
    enum: ['Basic', 'Standard', 'Premium'],
    required: true
  },
  poojaType: { type: String, default: 'General' }, // Griha Pravesh, Satyanarayan, etc.
  items: [packageItemSchema],
  originalPrice: { type: Number, required: true },
  discountedPrice: { type: Number, required: true },
  image: { type: String, default: '' },
  availableCities: [{ type: String }], // empty = available everywhere
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('SamagriPackage', samagriPackageSchema);
