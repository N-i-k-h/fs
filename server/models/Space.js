const mongoose = require('mongoose');

const spaceSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true }, // Keeping legacy ID for frontend compatibility
    name: { type: String, required: true },
    description: { type: String, required: true },
    city: { type: String, required: true },
    location: { type: String, required: true },
    type: { type: [String], required: true }, // Changed to array to support multiple categories
    price: { type: Number, required: true },
    seats: { type: Number, required: true },
    availableSeats: { type: Number, default: 0 }, // New field for currently available seats
    rating: { type: Number, default: 0 },
    images: [{ type: String }],
    amenities: [{ type: String }],
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Linked to Broker/Admin
    googleMapUrl: { type: String },
    isFeatured: { type: Boolean, default: false },
    snapshot: { type: mongoose.Schema.Types.Mixed }, // flexible object

    // --- Connect Platform Technical Specs ---
    technicalSpecs: {
        floorToCeiling: String,
        passengerLifts: Number,
        serviceLifts: Number,
        hvacType: String,
        powerBackup: String,
        fireCompliance: String,
        itSezStatus: String
    },

    // --- Detailed Commercials ---
    commercialDetails: {
        rentPSFT: String,
        camCharges: String,
        securityDeposit: String,
        lockInPeriod: String,
        leaseTenure: String,
        escalation: String
    },

    highlights: [{ title: String, desc: String }],
    commercials: [{ component: String, cost: String, remarks: String }],
    compliance: [{ title: String, status: String, desc: String }]
}, { timestamps: true });

module.exports = mongoose.model('Space', spaceSchema);
