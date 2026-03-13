const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const updateAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        // Normalizing email to lowercase as in authRoutes.js
        const email = 'admin@flickspace.com'.toLowerCase();
        const password = 'admin'; // Testing easy password

        let user = await User.findOne({ email });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        if (user) {
            user.role = 'admin';
            user.password = hashedPassword;
            await user.save();
            console.log('✅ Admin updated to email: admin@flickspace.com, password: admin');
        } else {
            user = new User({
                name: 'System Admin',
                email: email,
                password: hashedPassword,
                role: 'admin'
            });
            await user.save();
            console.log('✅ Admin created with email: admin@flickspace.com, password: admin');
        }

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

updateAdmin();
