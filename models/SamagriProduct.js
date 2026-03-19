// Poojan Samagri Product Model
const mongoose = require('mongoose');

const samagriProductSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  category: {
    type: String,
    enum: ['Incense', 'Flowers', 'Diyas', 'Ghee', 'Sweets', 'Cloth', 'Idols', 'Other'],
    default: 'Other'
  },
  image: { type: String, default: '' },
  price: { type: Number, required: true },
  unit: { type: String, default: 'piece' }, // piece, kg, litre, pack
  inStock: { type: Boolean, default: true },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('SamagriProduct', samagriProductSchema);
