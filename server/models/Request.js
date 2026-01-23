const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
    user: { type: String, required: true }, // User Name
    email: { type: String, required: true },
    phone: { type: String, required: true },
    spaceName: { type: String }, // Assuming space name is sent, or space ID ref if you prefer
    space: { type: String },     // Frontend sends "space", keeping both for safety or unifying
    date: { type: String },
    time: { type: String },
    seats: { type: Number },
    status: { type: String, default: 'pending' }, // pending, approved, rejected
    type: { type: String, default: 'Tour Request' }, // Tour Request, Contact
    totalAmount: { type: Number, default: 0 }, // For revenue calculation

    // Quote / Brochure specific fields
    budget: { type: String },
    timeline: { type: String },
    micromarket: { type: String },
    isBrochureDownloaded: { type: Boolean, default: false },
    details: { type: Object }, // For flexible additional data
}, { timestamps: true });

module.exports = mongoose.model('Request', requestSchema);
