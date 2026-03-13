const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const testLoginSim = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        const emailInput = 'admin@flickspace.com';
        const passwordInput = 'admin';

        console.log(`Simulating login for ${emailInput}...`);

        let user = await User.findOne({ email: emailInput.toLowerCase() });
        if (!user) {
            console.log('❌ User not found in DB');
            process.exit(1);
        }

        console.log(`✅ User found: ${user.name}, Role: ${user.role}`);

        if (!user.password) {
            console.log('❌ User has no password (Google Auth users?)');
            process.exit(1);
        }

        const isMatch = await bcrypt.compare(passwordInput, user.password);
        if (isMatch) {
            console.log('✅ Password matches! (SIMULATION SUCCESS)');
        } else {
            console.log('❌ Password mismatch detected!');
        }

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

testLoginSim();
