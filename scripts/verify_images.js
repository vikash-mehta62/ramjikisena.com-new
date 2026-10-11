const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const mongoose = require('mongoose');
const Mandir = require('../models/Mandir');

async function verifyImages() {
  await mongoose.connect(process.env.DB_CONNECTION_STRING);
  const mandirs = await Mandir.find({}, { name: 1, photos: 1, 'location.city': 1 });
  console.log(`Checking images for ${mandirs.length} mandirs in DB...\n`);

  let valid = 0;
  let invalid = 0;
  let noPhoto = 0;

  for (const m of mandirs) {
    if (!m.photos || m.photos.length === 0) {
      console.log(`⚪ [NO PHOTO] ${m.name} (${m.location?.city})`);
      noPhoto++;
      continue;
    }

    for (const url of m.photos) {
      try {
        const res = await fetch(url, {
          method: 'GET',
          headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36' },
          signal: AbortSignal.timeout(8000)
        });
        const contentType = res.headers.get('content-type');
        if (res.status === 200 && contentType && contentType.startsWith('image/')) {
          console.log(`✅ [200 OK] ${m.name} (${m.location?.city}) -> ${contentType}`);
          valid++;
        } else {
          console.log(`❌ [${res.status} FAIL] ${m.name} (${m.location?.city}) -> ${contentType} | URL: ${url}`);
          invalid++;
        }
      } catch (e) {
        console.log(`❌ [ERR] ${m.name} -> ${e.message} | URL: ${url}`);
        invalid++;
      }
    }
  }

  console.log(`\nResults: ${valid} valid live images, ${invalid} invalid/broken, ${noPhoto} without photos.`);
  await mongoose.disconnect();
}

verifyImages();
