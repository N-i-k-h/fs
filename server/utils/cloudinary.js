const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Log configuration (without exposing secret)
console.log('Cloudinary Config:', {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET ? '***configured***' : 'MISSING'
});

// Configure Cloudinary Storage for Multer
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        return {
            folder: 'flickspace',
            allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'heic'],
            transformation: [{ width: 1920, height: 1080, crop: 'limit' }]
        };
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // Increased to 10MB
    },
    fileFilter: (req, file, cb) => {
        console.log('Multer receiving file:', file.originalname);
        cb(null, true);
    }
});

module.exports = { cloudinary, upload };
