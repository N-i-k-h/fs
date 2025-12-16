const mongoose = require('mongoose');
const Request = require('./models/Request');
require('dotenv').config();

const debugRequests = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        const requests = await Request.find().sort({ createdAt: -1 });
        console.log('--- ALL REQUESTS ---');
        console.log(JSON.stringify(requests, null, 2));
        console.log('--------------------');

        process.exit();
    } catch (err) {
        console.error('❌ Error:', err);
        process.exit(1);
    }
};

debugRequests();
