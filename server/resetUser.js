const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const emailToDelete = 'nkashyappp18@gmail.com'; // Change this if testing another email

const resetUser = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        const result = await User.deleteOne({ email: emailToDelete });

        if (result.deletedCount > 0) {
            console.log(`✅ User ${emailToDelete} deleted successfully.`);
            console.log('👉 Now Login with Google to trigger Welcome Email');
        } else {
            console.log(`⚠️ User ${emailToDelete} not found (Already deleted?).`);
            console.log('👉 You should be able to register as a new user now.');
        }

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

resetUser();
