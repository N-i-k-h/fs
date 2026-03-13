const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const listUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        const users = await User.find({}, 'name email role');
        console.log('--- User List ---');
        users.forEach(u => {
            console.log(`- ${u.name} | ${u.email} | Role: ${u.role}`);
        });
        console.log('-----------------');

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

listUsers();
