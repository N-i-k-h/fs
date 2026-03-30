const mongoose = require('mongoose');

const proposalSchema = new mongoose.Schema({
    rfpId: { type: mongoose.Schema.Types.ObjectId, ref: 'Request', required: true },
    brokerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    spaceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Space', required: true },
    message: { type: String },
    status: { type: String, default: 'pending' }, // pending, approved, rejected
}, { timestamps: true });

module.exports = mongoose.model('Proposal', proposalSchema);
