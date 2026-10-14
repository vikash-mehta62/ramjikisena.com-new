/**
 * Deprecated: Cloudinary is replaced by AWS S3.
 * Calls to uploadToCloudinary are automatically routed to uploadToS3.
 */
const { uploadToS3, deleteFromS3 } = require('./s3');

const uploadToCloudinary = async (file, folder = 'mandirs') => {
  console.log(`[DEPRECATION NOTICE] uploadToCloudinary called. Redirecting to AWS S3 (folder: ${folder})...`);
  return await uploadToS3(file, folder);
};

const deleteFromCloudinary = async (publicIdOrUrl) => {
  console.log(`[DEPRECATION NOTICE] deleteFromCloudinary called. Redirecting to AWS S3...`);
  return await deleteFromS3(publicIdOrUrl);
};

module.exports = { 
  uploadToCloudinary,
  deleteFromCloudinary
};
