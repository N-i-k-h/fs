const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const createSuperAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        const admins = [
            { email: 'admin@flickspace.com', password: 'AdminPassword123!', name: 'Super Admin' },
            { email: 'nikhilkashyapkn@gmail.com', password: 'adminsft@2026', name: 'Nikhil Admin' }
        ];

        for (const admin of admins) {
            const email = admin.email.toLowerCase();
            const password = admin.password;
            
            let user = await User.findOne({ email });
            if (user) {
                console.log(`User ${email} already exists, updating to admin role...`);
                user.role = 'admin';
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(password, salt);
                await user.save();
                console.log(`✅ User ${email} updated to Admin`);
            } else {
                console.log(`Creating new Admin ${email}...`);
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(password, salt);

                user = new User({
                    name: admin.name,
                    email: email,
                    password: hashedPassword,
                    role: 'admin'
                });
                await user.save();
                console.log(`✅ Admin ${email} created successfully`);
            }
        }

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

createSuperAdmin();
