const express = require('express');
const router = express.Router();
const path = require('path');
const { uploadToS3 } = require('../lib/s3');
const { uploadToCloudinary } = require('../lib/cloudinary');
const fs = require('fs').promises;
const adminAuth = require('./middleware/adminAuth');
const isLoggedInAPI = require('./middleware/isLoggedInAPI');

// Allow admin, staff, or any authenticated user for uploads
const uploadAuth = (req, res, next) => {
  // Try adminAuth first; if forbidden because role is regular user, fallback to isLoggedInAPI
  adminAuth(req, res, (err) => {
    if (!err && req.user) return next();
    isLoggedInAPI(req, res, next);
  });
};

/**
 * Universal upload helper (uses S3 if AWS credentials exist, else Cloudinary)
 */
const uploadImageHelper = async (file, folder) => {
  if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
    return await uploadToS3(file, folder);
  }
  return await uploadToCloudinary(file, folder);
};

/**
 * POST /api/upload/image
 * Upload single image to S3 / Cloudinary
 */
router.post('/image', uploadAuth, async (req, res) => {
  try {
    // Check if file exists
    const imageFile = req.files ? (req.files.image || req.files.file) : null;
    if (!imageFile) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided'
      });
    }

    // Validate file type
    if (!imageFile.mimetype.startsWith('image/')) {
      return res.status(400).json({
        success: false,
        message: 'Only image files are allowed'
      });
    }

    // Create temp file object
    const tempFile = {
      path: imageFile.tempFilePath,
      originalname: imageFile.name,
      mimetype: imageFile.mimetype
    };

    const folder = req.query.folder || 'mandirs';
    const imageUrl = await uploadImageHelper(tempFile, folder);

    // Delete temporary file
    try {
      await fs.unlink(imageFile.tempFilePath);
    } catch (err) {
      console.error('Error deleting temp file:', err);
    }

    res.json({
      success: true,
      message: 'Image uploaded successfully',
      url: imageUrl
    });

  } catch (error) {
    console.error('Upload error:', error);
    
    // Clean up temp file if exists
    if (req.files && req.files.image && req.files.image.tempFilePath) {
      try {
        await fs.unlink(req.files.image.tempFilePath);
      } catch (unlinkError) {
        console.error('Error deleting temp file:', unlinkError);
      }
    }

    res.status(500).json({
      success: false,
      message: 'Failed to upload image',
      error: error.message
    });
  }
});

/**
 * POST /api/upload/images
 * Upload multiple images to S3 / Cloudinary
 */
router.post('/images', uploadAuth, async (req, res) => {
  try {
    if (!req.files || !req.files.images) {
      return res.status(400).json({
        success: false,
        message: 'No image files provided'
      });
    }

    // Handle both single and multiple files
    const images = Array.isArray(req.files.images) 
      ? req.files.images 
      : [req.files.images];

    const folder = req.query.folder || 'mandirs';
    
    // Upload all images
    const uploadPromises = images.map(imageFile => {
      const tempFile = {
        path: imageFile.tempFilePath,
        originalname: imageFile.name,
        mimetype: imageFile.mimetype
      };
      return uploadImageHelper(tempFile, folder);
    });
    
    const imageUrls = await Promise.all(uploadPromises);

    // Delete all temporary files
    const deletePromises = images.map(imageFile => 
      fs.unlink(imageFile.tempFilePath).catch(err => 
        console.error('Error deleting temp file:', err)
      )
    );
    await Promise.all(deletePromises);

    res.json({
      success: true,
      message: 'Images uploaded successfully',
      urls: imageUrls
    });

  } catch (error) {
    console.error('Upload error:', error);
    
    // Clean up temp files
    if (req.files && req.files.images) {
      const images = Array.isArray(req.files.images) 
        ? req.files.images 
        : [req.files.images];
      
      const deletePromises = images.map(imageFile => 
        fs.unlink(imageFile.tempFilePath).catch(err => 
          console.error('Error deleting temp file:', err)
        )
      );
      await Promise.all(deletePromises);
    }

    res.status(500).json({
      success: false,
      message: 'Failed to upload images',
      error: error.message
    });
  }
});

module.exports = router;
