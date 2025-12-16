const mongoose = require('mongoose');

const spaceSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true }, // Keeping legacy ID for frontend compatibility
    name: { type: String, required: true },
    description: { type: String, required: true },
    city: { type: String, required: true },
    location: { type: String, required: true },
    type: { type: String, required: true }, // 'private-office', 'dedicated-desk', etc.
    price: { type: Number, required: true },
    seats: { type: Number, required: true },
    rating: { type: Number, default: 0 },
    images: [{ type: String }],
    amenities: [{ type: String }],
    isFeatured: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Space', spaceSchema);
