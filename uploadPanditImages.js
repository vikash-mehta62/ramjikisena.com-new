require('dotenv').config();
const https = require('https');
const http = require('http');
const { uploadBufferToS3 } = require('./lib/s3');

// Paste your actual image URLs here (any public URL works)
const images = [
  { name: 'pandit_1', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Puja_at_home.jpg/440px-Puja_at_home.jpg' },
  { name: 'pandit_2', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Hindu_priest.jpg/440px-Hindu_priest.jpg' },
  { name: 'pandit_3', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Havan.jpg/440px-Havan.jpg' },
  { name: 'pandit_4', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Brahmin.jpg/440px-Brahmin.jpg' },
  { name: 'pandit_5', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Hindu_wedding.jpg/440px-Hindu_wedding.jpg' },
];

function fetchBuffer(url) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    protocol.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      const chunks = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => resolve(Buffer.concat(chunks)));
    }).on('error', reject);
  });
}

async function uploadAll() {
  console.log('Uploading pandit images to AWS S3...\n');
  for (const img of images) {
    try {
      const buffer = await fetchBuffer(img.url);
      const s3Url = await uploadBufferToS3(buffer, `${img.name}.jpg`, 'image/jpeg', 'pandits');
      console.log(`✅ ${img.name}: ${s3Url}`);
    } catch (err) {
      console.log(`❌ ${img.name}: ${err.message}`);
    }
  }
}

// Only run if called directly
if (require.main === module) {
  uploadAll();
}

module.exports = uploadAll;
