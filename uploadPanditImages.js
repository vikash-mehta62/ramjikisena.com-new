require('dotenv').config();
const cloudinary = require('cloudinary').v2;
const https = require('https');
const http = require('http');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Paste your actual image URLs here (any public URL works)
const images = [
  { name: 'pandit_1', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Puja_at_home.jpg/440px-Puja_at_home.jpg' },
  { name: 'pandit_2', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Hindu_priest.jpg/440px-Hindu_priest.jpg' },
  { name: 'pandit_3', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Havan.jpg/440px-Havan.jpg' },
  { name: 'pandit_4', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Brahmin.jpg/440px-Brahmin.jpg' },
  { name: 'pandit_5', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Hindu_wedding.jpg/440px-Hindu_wedding.jpg' },
];

async function uploadAll() {
  console.log('Uploading pandit images to Cloudinary...\n');
  for (const img of images) {
    try {
      const result = await cloudinary.uploader.upload(img.url, {
        folder: 'pandits',
        public_id: img.name,
        overwrite: true,
      });
      console.log(`✅ ${img.name}: ${result.secure_url}`);
    } catch (err) {
      console.log(`❌ ${img.name}: ${err.message}`);
    }
  }
}

uploadAll();
