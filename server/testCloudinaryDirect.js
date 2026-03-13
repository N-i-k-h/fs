require('dotenv').config();
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

async function testCloudinary() {
    console.log('Testing Cloudinary with Config:', {
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: '***'
    });

    try {
        const result = await cloudinary.uploader.upload("https://res.cloudinary.com/demo/image/upload/sample.jpg", {
            folder: "test_flickspace"
        });
        console.log("✅ Cloudinary Connection Successful!");
        console.log("Result:", result.secure_url);
    } catch (error) {
        console.error("❌ Cloudinary Connection Failed!");
        console.error(error);
    }
}

testCloudinary();
