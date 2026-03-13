require('dotenv').config();
const cloudinary = require('cloudinary').v2;

async function testCloudinaryAlternative() {
    const configs = [
        { cloud_name: 'flickspace', api_key: '389975192592857', api_secret: 'G1VBm0r-A_MR3YXcBbf4dBB9fWs' },
        { cloud_name: 'dqmfmhqzq', api_key: '389975192592857', api_secret: 'G1VBm0r-A_MR3YXcBbf4dBB9fWs' }
    ];

    for (const config of configs) {
        console.log(`\n🔍 Testing Config: ${config.cloud_name}...`);
        cloudinary.config(config);

        try {
            const result = await cloudinary.uploader.upload("https://res.cloudinary.com/demo/image/upload/sample.jpg", {
                folder: "test_flickspace"
            });
            console.log(`✅ SUCCESS for ${config.cloud_name}!`);
            console.log("URL:", result.secure_url);
            return; // Stop if one works
        } catch (error) {
            console.error(`❌ FAILED for ${config.cloud_name}:`, error.message);
        }
    }
}

testCloudinaryAlternative();
