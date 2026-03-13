const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const createSuperAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        const email = 'admin@flickspace.com';
        const password = 'AdminPassword123!';

        let user = await User.findOne({ email });
        if (user) {
            console.log('User already exists, updating to admin role...');
            user.role = 'admin';
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
            await user.save();
            console.log('✅ User updated to Admin');
        } else {
            console.log('Creating new Super Admin...');
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            user = new User({
                name: 'Super Admin',
                email: email,
                password: hashedPassword,
                role: 'admin'
            });
            await user.save();
            console.log('✅ Super Admin created successfully');
        }

        console.log('\n--- Admin Credentials ---');
        console.log(`Email: ${email}`);
        console.log(`Password: ${password}`);
        console.log('-------------------------\n');

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

createSuperAdmin();
