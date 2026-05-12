const mongoose = require('mongoose');

const featureBidSchema = new mongoose.Schema({
    partnerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    spaceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Space', required: true },
    bidAmount: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'accepted', 'rejected', 'paid'], default: 'pending' }
}, { timestamps: true });

module.exports = mongoose.model('FeatureBid', featureBidSchema);
