const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const findAdmins = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        const admins = await User.find({ role: 'admin' });
        if (admins.length > 0) {
            console.log('Found Admins:');
            admins.forEach(admin => {
                console.log(`- ${admin.name} (${admin.email})`);
            });
        } else {
            console.log('No admins found.');
        }

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

findAdmins();
