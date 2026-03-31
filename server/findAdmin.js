const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');

const findAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const admins = await User.find({ role: 'admin' });
        
        if (admins.length > 0) {
            admins.forEach(a => {
                console.log(`ADMIN_USER found: ${a.email} (${a.name})`);
            });
        } else {
            console.log('No admin found. Create one?');
        }
        
        await mongoose.connection.close();
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

findAdmin();
