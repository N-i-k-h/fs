const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String }, // Optional for Google Auth users
    role: { type: String, enum: ['user', 'admin', 'manager', 'founder', 'employee', 'broker'], default: 'user' },
    googleId: { type: String }, // For Google Auth
    avatar: { type: String },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
