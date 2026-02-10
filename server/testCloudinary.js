require('dotenv').config();
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

console.log('Testing Cloudinary Configuration...\n');
console.log('Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME);
console.log('API Key:', process.env.CLOUDINARY_API_KEY);
console.log('API Secret:', process.env.CLOUDINARY_API_SECRET ? '***configured***' : 'MISSING');
console.log('\n');

// Test the connection by getting account details
cloudinary.api.ping()
    .then(result => {
        console.log('✅ Cloudinary connection successful!');
        console.log('Response:', result);
    })
    .catch(error => {
        console.log('❌ Cloudinary connection failed!');
        console.error('Error:', error.message);
        console.error('Error details:', error);
    });
