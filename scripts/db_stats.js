const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const Mandir = require('../models/Mandir');

async function getStats() {
  await mongoose.connect(process.env.DB_CONNECTION_STRING);
  const total = await Mandir.countDocuments();
  const all = await Mandir.find({}, { name: 1, 'location.city': 1, 'location.state': 1, photos: 1, source: 1, verificationStatus: 1 }).sort({ 'location.city': 1, name: 1 });

  let curatedSeeded = 0;
  let preExisting = 0;
  let withPhotos = 0;
  let withPlaceholder = 0;

  const cityMap = {};

  all.forEach(m => {
    if (m.source === 'curated') curatedSeeded++;
    else preExisting++;

    if (m.photos && m.photos.length > 0) withPhotos++;
    else withPlaceholder++;

    const city = m.location?.city || 'Other';
    if (!cityMap[city]) cityMap[city] = [];
    cityMap[city].push({
      name: m.name,
      hasPhoto: m.photos && m.photos.length > 0,
      source: m.source || 'pre-existing'
    });
  });

  console.log('--- SUMMARY STATS ---');
  console.log(`TOTAL_IN_DB: ${total}`);
  console.log(`CURATED_SEEDED: ${curatedSeeded}`);
  console.log(`PRE_EXISTING: ${preExisting}`);
  console.log(`WITH_LIVE_PHOTOS: ${withPhotos}`);
  console.log(`WITH_PLACEHOLDERS: ${withPlaceholder}\n`);

  console.log('--- CITY WISE BREAKDOWN ---');
  for (const [city, list] of Object.entries(cityMap)) {
    console.log(`📍 ${city} (${list.length} temples):`);
    list.forEach(item => {
      console.log(`   - ${item.name} [${item.hasPhoto ? '🖼️ Photo' : '🛕 Placeholder'}]`);
    });
  }

  await mongoose.disconnect();
}

getStats();
