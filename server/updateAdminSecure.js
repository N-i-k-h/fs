const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const updateAdminToSecure = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        // Normalizing email to lowercase as in authRoutes.js
        const email = 'admin@flickspace.com'.toLowerCase();
        const password = 'AdminPassword123!';

        let user = await User.findOne({ email });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        if (user) {
            user.role = 'admin';
            user.password = hashedPassword;
            await user.save();
            console.log(`✅ Admin updated: ${email}, Password: ${password}`);
        } else {
            console.log('❌ Admin not found, something is wrong.');
        }

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

updateAdminToSecure();
