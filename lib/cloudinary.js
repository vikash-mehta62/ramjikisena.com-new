const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

/**
 * Upload image to Cloudinary
 * @param {Object} file - Multer file object
 * @param {String} folder - Subfolder name (e.g., 'mandirs', 'blogs')
 * @returns {String} - Secure URL of uploaded image
 */
const uploadToCloudinary = async (file, folder = 'mandirs') => {
  try {
    // Create folder path with main folder
    const folderPath = process.env.CLOUDINARY_FOLDER 
      ? `${process.env.CLOUDINARY_FOLDER}/${folder}` 
      : folder;

    const result = await cloudinary.uploader.upload(file.path, {
      folder: folderPath,
      resource_type: 'auto',
      transformation: [
        { width: 1920, height: 1080, crop: 'limit' },
        { quality: 'auto:good' }
      ]
    });

    return result.secure_url;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Image upload failed');
  }
};

/**
 * Delete image from Cloudinary
 * @param {String} publicId - Public ID of the image
 */
const deleteFromCloudinary = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw new Error('Image deletion failed');
  }
};

module.exports = { 
  cloudinary, 
  uploadToCloudinary,
  deleteFromCloudinary
};
