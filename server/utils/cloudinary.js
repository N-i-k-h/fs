const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Check if Cloudinary is properly configured
const isCloudinaryConfigured =
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET &&
    !process.env.CLOUDINARY_CLOUD_NAME.includes('placeholder') &&
    !process.env.CLOUDINARY_CLOUD_NAME.includes('123_abc');

console.log('Cloudinary Enabled:', isCloudinaryConfigured);

let storage;

if (isCloudinaryConfigured) {
    // Configure Cloudinary Storage
    storage = new CloudinaryStorage({
        cloudinary: cloudinary,
        params: async (req, file) => {
            return {
                folder: 'flickspace',
                allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'heic'],
                transformation: [{ width: 1920, height: 1080, crop: 'limit' }]
            };
        }
    });
} else {
    // Fallback to Local Storage
    console.log('⚠️ Using LOCAL STORAGE for uploads as Cloudinary is not configured correctly.');
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }

    storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, uploadDir);
        },
        filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            cb(null, uniqueSuffix + '-' + file.originalname.replace(/\s/g, '_'));
        }
    });
}

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB
    }
});

module.exports = { cloudinary, upload, isCloudinaryConfigured };
