const mongoose = require('mongoose');
require('dotenv').config();

console.log('Attempting to connect to:', process.env.MONGO_URI);

mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 })
    .then(() => {
        console.log('✅ CONNECTED TO MONGO');
        process.exit(0);
    })
    .catch(err => {
        console.error('❌ FAILED TO CONNECT:', err.message);
        process.exit(1);
    });
