// Mandir Model Schema
const mongoose = require('mongoose');

const mandirSchema = mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  history: { type: String, default: '' },
  significance: { type: String, default: '' }, // Religious importance / why famous

  // Temple classification
  templeType: {
    type: String,
    enum: ['Jyotirlinga', 'Shakti Peeth', 'Char Dham', 'Divya Desam', 'Ashtavinayak', 'Other'],
    default: 'Other'
  },
  architecture: { type: String, default: '' }, // e.g., "Dravidian", "Nagara"
  builtYear: { type: String, default: '' },     // e.g., "12th Century" or "1850"
  languages: [String],                          // Languages spoken at temple

  photos: [{ type: String }],
  videos: [{ type: String }],                   // YouTube embed URLs

  location: {
    address: String,
    city: String,
    state: String,
    pincode: String,
    country: { type: String, default: 'India' },
    coordinates: { lat: Number, lng: Number }
  },

  timing: {
    opening: String,
    closing: String,
    aarti: [{ name: String, time: String }],  // e.g. [{name: "Mangala Aarti", time: "5:00 AM"}]
    specialTimings: String,
    specialDays: [{
      day: String,        // e.g. "Monday", "Ekadashi"
      opening: String,
      closing: String,
      note: String        // e.g. "Closed 12-4 PM"
    }]
  },

  contact: {
    phone: String,
    email: String,
    website: String
  },

  deity: {
    main: String,
    others: [String]
  },

  festivals: [{
    name: String,
    month: String,
    description: String
  }],

  facilities: {
    parking: { type: Boolean, default: false },
    prasad: { type: Boolean, default: false },
    accommodation: { type: Boolean, default: false },
    wheelchairAccessible: { type: Boolean, default: false },
    restrooms: { type: Boolean, default: false },
    drinkingWater: { type: Boolean, default: false },
    cloakroom: { type: Boolean, default: false },
    medicalAid: { type: Boolean, default: false },
    foodStalls: { type: Boolean, default: false }
  },

  visitInfo: {
    bestTimeToVisit: String,
    dressCode: String,
    entryFee: String,
    photographyAllowed: { type: Boolean, default: true },
    mobileAllowed: { type: Boolean, default: true },
    shoeStand: { type: Boolean, default: true },
    annualVisitors: String,
    donationInfo: String,   // e.g. "Online donation available at..."
    trustName: String,      // e.g. "Shri Ram Mandir Trust"
    managedBy: String       // e.g. "Archeological Survey of India"
  },

  nearbyAttractions: [{
    name: String,
    distance: String,
    type: String
  }],

  socialMedia: {
    facebook: String,
    instagram: String,
    youtube: String,
    twitter: String
  },

  reviews: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    rating: { type: Number, min: 1, max: 5 },
    text: String,
    createdAt: { type: Date, default: Date.now }
  }],

  averageRating: { type: Number, default: 0 },

  // SUBMISSION & APPROVAL
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'approved'
  },
  submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'user', default: null },
  rejectionReason: { type: String, default: '' },

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('mandir', mandirSchema);

