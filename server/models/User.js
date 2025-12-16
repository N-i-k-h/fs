const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String }, // Optional for Google Auth users
    role: { type: String, enum: ['user', 'admin', 'manager', 'founder', 'employee'], default: 'user' },
    googleId: { type: String }, // For Google Auth
    avatar: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
