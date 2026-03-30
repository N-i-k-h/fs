const mongoose = require('mongoose');
require('dotenv').config();

const deleteUser = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('🔗 MongoDB Connected for user deletion');
        
        const result = await mongoose.connection.collection('users').deleteOne({ email: 'nkashyappp18@gmail.com' });
        console.log('🗑️ Delete Result:', result);
        
        await mongoose.connection.close();
        process.exit(0);
    } catch (err) {
        console.error('❌ Delete Error:', err.message);
        process.exit(1);
    }
};

deleteUser();
