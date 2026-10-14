// scripts/importOsmMandirs.js
// Imports local Hindu temples from OpenStreetMap for MP cities in regional batches.
// Enforces strict data integrity: NO fake photos, NO unconfirmed timings, and prevents duplicates.

const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const Mandir = require('../models/Mandir');

const REGIONS = [
  { name: 'Bhopal', state: 'Madhya Pradesh', bbox: '23.18,77.34,23.32,77.48', limit: 12 },
  { name: 'Indore', state: 'Madhya Pradesh', bbox: '22.68,75.80,22.78,75.92', limit: 12 },
  { name: 'Ujjain', state: 'Madhya Pradesh', bbox: '23.14,75.74,23.22,75.82', limit: 8 },
  { name: 'Vidisha', state: 'Madhya Pradesh', bbox: '23.50,77.78,23.56,77.84', limit: 8 },
  { name: 'Sagar', state: 'Madhya Pradesh', bbox: '23.80,78.72,23.88,78.80', limit: 8 },
  { name: 'Bhojpur', state: 'Madhya Pradesh', bbox: '23.08,77.55,23.14,77.62', limit: 5 }
];

const OVERPASS_MIRRORS = [
  'https://overpass-api.de/api/interpreter',
  'https://maps.mail.ru/osm/tools/overpass/api/interpreter'
];

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Compute distance in meters between two lat/lng points (Haversine)
function getDistanceMeters(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 999999;
  const R = 6371e3;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function normalizeName(str) {
  return (str || '')
    .toLowerCase()
    .replace(/[^\w\s\u0900-\u097F]/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
}

async function fetchFromOSM(bbox, limit) {
  // Query for named Hindu places of worship within bounding box
  const query = `
    [out:json][timeout:25];
    (
      node["amenity"="place_of_worship"]["religion"="hindu"]["name"](${bbox});
      way["amenity"="place_of_worship"]["religion"="hindu"]["name"](${bbox});
    );
    out center ${limit};
  `;

  for (const mirror of OVERPASS_MIRRORS) {
    try {
      const response = await fetch(mirror, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': 'RamJiKiSenaOSMImporter/1.0 (contact@ramjikisena.com)'
        },
        body: 'data=' + encodeURIComponent(query),
        signal: AbortSignal.timeout(15000)
      });
      if (response.ok) {
        const json = await response.json();
        return json.elements || [];
      }
    } catch (e) {
      // try next mirror
    }
  }
  return [];
}

async function runImporter() {
  console.log('🔄 Connecting to MongoDB...');
  await mongoose.connect(process.env.DB_CONNECTION_STRING);
  console.log('✅ Connected to MongoDB.');

  // Load existing mandirs to prevent duplicates
  const existingMandirs = await Mandir.find({}, { name: 1, 'location.city': 1, 'location.coordinates': 1, source: 1 });
  console.log(`📋 Found ${existingMandirs.length} existing mandirs in DB for deduplication check.\n`);

  let totalImported = 0;
  let totalSkipped = 0;

  for (const region of REGIONS) {
    console.log(`📡 Fetching local temples for [${region.name}]...`);
    const elements = await fetchFromOSM(region.bbox, region.limit);
    console.log(`   Found ${elements.length} OSM candidates in ${region.name}.`);

    let regionAdded = 0;

    for (const el of elements) {
      const tags = el.tags || {};
      const rawName = tags['name:hi'] || tags.name || tags['name:en'];
      if (!rawName) continue;

      const lat = el.lat || el.center?.lat;
      const lng = el.lon || el.center?.lon;
      if (!lat || !lng) continue;

      // Duplicate check: Check by name or GPS proximity (< 400m)
      const normNew = normalizeName(rawName);
      const isDuplicate = existingMandirs.some(existing => {
        const sameCity = (existing.location?.city || '').toLowerCase() === region.name.toLowerCase();
        const normExist = normalizeName(existing.name);
        const nameMatch = normExist.includes(normNew) || normNew.includes(normExist);
        const coords = existing.location?.coordinates;
        const dist = coords ? getDistanceMeters(lat, lng, coords.lat, coords.lng) : 999999;

        return (sameCity && nameMatch) || dist < 400;
      });

      if (isDuplicate) {
        totalSkipped++;
        continue;
      }

      // Infer deity if present in tags or name
      let mainDeity = tags.deity || '';
      if (!mainDeity) {
        const lower = rawName.toLowerCase();
        if (lower.includes('हनुमान') || lower.includes('hanuman') || lower.includes('balaji')) mainDeity = 'श्री हनुमान जी';
        else if (lower.includes('शिव') || lower.includes('shiv') || lower.includes('mahadev') || lower.includes('महादेव')) mainDeity = 'भगवान शिव';
        else if (lower.includes('गणेश') || lower.includes('ganesh') || lower.includes('ganpati')) mainDeity = 'श्री गणेश जी';
        else if (lower.includes('दुर्गा') || lower.includes('durga') || lower.includes('माता') || lower.includes('mata') || lower.includes('devi')) mainDeity = 'माँ दुर्गा / देवी';
        else if (lower.includes('राम') || lower.includes('ram')) mainDeity = 'प्रभु श्री राम';
        else if (lower.includes('कृष्ण') || lower.includes('krishna')) mainDeity = 'श्री कृष्ण';
        else mainDeity = 'सनातन देवी/देवता';
      }

      // Address construction
      const addressParts = [
        tags['addr:street'] || tags['addr:suburb'] || tags['addr:neighbourhood'],
        region.name,
        region.state
      ].filter(Boolean);

      const mandirDoc = {
        name: rawName,
        description: `${region.name} के स्थानीय क्षेत्र में स्थित पावन मंदिर। यह स्थानीय निवासियों की आस्था का प्रमुख केंद्र है।`,
        templeType: 'Other',
        location: {
          address: addressParts.join(', '),
          city: region.name,
          state: region.state,
          pincode: tags['addr:postcode'] || '',
          country: 'India',
          coordinates: { lat, lng }
        },
        deity: { main: mainDeity },
        // STRICT INTEGRITY RULES:
        photos: [], // Never invent or assign fake photos!
        photoAttributions: [],
        timing: tags.opening_hours ? { specialTimings: tags.opening_hours } : {},
        timingsVerified: false, // Unverified
        source: 'osm',
        sourceId: `osm-${el.type}-${el.id}`,
        verificationStatus: 'unverified',
        status: 'approved'
      };

      const saved = await Mandir.create(mandirDoc);
      existingMandirs.push(saved);
      regionAdded++;
      totalImported++;
    }

    console.log(`   ✓ Imported ${regionAdded} new local temples for ${region.name}.`);
    // Polite delay before querying next city
    await sleep(1500);
  }

  const finalCount = await Mandir.countDocuments();
  console.log(`\n===========================================`);
  console.log(`🎉 OSM IMPORT COMPLETE!`);
  console.log(`   Total New Imported: ${totalImported}`);
  console.log(`   Total Duplicates Skipped: ${totalSkipped}`);
  console.log(`   Total Mandirs in Database: ${finalCount}`);
  console.log(`===========================================\n`);

  await mongoose.disconnect();
  console.log('👋 Disconnected.');
}

// Auto-seed execution disabled to prevent accidental data overwrites
// runImporter().catch(err => {
//   console.error('Importer error:', err);
//   process.exit(1);
// });

module.exports = runImporter;
