const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const createBroker = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        const email = 'broker@test.com';
        const password = 'BrokerPassword123!';
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        await User.findOneAndDelete({ email });

        const broker = new User({
            name: 'Test Broker',
            email: email,
            password: hashedPassword,
            role: 'broker'
        });

        await broker.save();
        console.log('✅ Broker user created successfully');
        console.log('Email:', email);
        console.log('Password:', password);

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

createBroker();
