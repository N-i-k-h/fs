const mongoose = require('mongoose');
const Request = require('./models/Request');
require('dotenv').config();

const debugRequests = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        // Find the most recent request
        const request = await Request.findOne().sort({ createdAt: -1 });
        console.log('--- MOST RECENT REQUEST ---');
        console.log('User:', request.user);
        console.log('Space (Field):', request.space);
        console.log('SpaceName (Field):', request.spaceName);
        console.log('Full Object:', JSON.stringify(request.toJSON(), null, 2));
        console.log('---------------------------');

        process.exit();
    } catch (err) {
        console.error('❌ Error:', err);
        process.exit(1);
    }
};

debugRequests();
