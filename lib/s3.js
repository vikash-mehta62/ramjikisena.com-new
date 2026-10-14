const { S3Client, PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Configure S3 Client
const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'ap-south-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET || 'inext-media-storage';
const BASE_FOLDER = process.env.AWS_S3_BASE_FOLDER || 'ramjikisena';
const REGION = process.env.AWS_REGION || 'ap-south-1';

// Common MIME types helper
const getMimeType = (filename) => {
  const ext = path.extname(filename).toLowerCase();
  const mimeMap = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
    '.pdf': 'application/pdf',
    '.mp4': 'video/mp4',
  };
  return mimeMap[ext] || 'application/octet-stream';
};

/**
 * Upload file to AWS S3
 * @param {Object} file - File object (supports express-fileupload, multer, or { path, originalname, mimetype })
 * @param {String} subfolder - Subfolder name (e.g., 'mandirs', 'blogs', 'pandits')
 * @returns {Promise<String>} - Public URL of uploaded file
 */
const uploadToS3 = async (file, subfolder = 'mandirs') => {
  try {
    const originalName = file.originalname || file.name || 'image.jpg';
    const ext = path.extname(originalName) || '.jpg';
    const baseName = path.basename(originalName, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    const uniqueSuffix = `${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
    const filename = `${baseName}_${uniqueSuffix}${ext}`;

    const filePath = file.path || file.tempFilePath;
    let fileBody;

    if (filePath && fs.existsSync(filePath)) {
      fileBody = fs.readFileSync(filePath);
    } else if (file.data && Buffer.isBuffer(file.data)) {
      fileBody = file.data;
    } else {
      throw new Error('No valid file data or path found for upload');
    }

    const contentType = file.mimetype || getMimeType(originalName);
    const key = `${BASE_FOLDER}/${subfolder}/${filename}`.replace(/\/+/g, '/');

    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: fileBody,
      ContentType: contentType,
    });

    await s3Client.send(command);

    const publicUrl = `https://${BUCKET_NAME}.s3.${REGION}.amazonaws.com/${key}`;
    return publicUrl;
  } catch (error) {
    console.error('AWS S3 upload error:', error);
    throw new Error(`S3 upload failed: ${error.message}`);
  }
};

/**
 * Upload buffer directly to AWS S3
 * @param {Buffer} buffer - File buffer
 * @param {String} filename - File name
 * @param {String} contentType - File content type
 * @param {String} subfolder - Subfolder name
 * @returns {Promise<String>} - Public URL
 */
const uploadBufferToS3 = async (buffer, filename, contentType, subfolder = 'mandirs') => {
  try {
    const ext = path.extname(filename) || '.jpg';
    const baseName = path.basename(filename, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    const uniqueSuffix = `${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
    const cleanFilename = `${baseName}_${uniqueSuffix}${ext}`;
    const key = `${BASE_FOLDER}/${subfolder}/${cleanFilename}`.replace(/\/+/g, '/');

    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: contentType || getMimeType(cleanFilename),
    });

    await s3Client.send(command);

    const publicUrl = `https://${BUCKET_NAME}.s3.${REGION}.amazonaws.com/${key}`;
    return publicUrl;
  } catch (error) {
    console.error('AWS S3 buffer upload error:', error);
    throw new Error(`S3 buffer upload failed: ${error.message}`);
  }
};

/**
 * Delete file from AWS S3 by key or URL
 * @param {String} keyOrUrl - S3 Key or full public URL
 */
const deleteFromS3 = async (keyOrUrl) => {
  try {
    let key = keyOrUrl;
    if (keyOrUrl.startsWith('http://') || keyOrUrl.startsWith('https://')) {
      const url = new URL(keyOrUrl);
      key = url.pathname.replace(/^\/+/, ''); // remove leading slash
    }

    const command = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    await s3Client.send(command);
    return true;
  } catch (error) {
    console.error('AWS S3 delete error:', error);
    throw new Error(`S3 delete failed: ${error.message}`);
  }
};

module.exports = {
  s3Client,
  uploadToS3,
  uploadBufferToS3,
  deleteFromS3,
  BUCKET_NAME,
  BASE_FOLDER,
};
