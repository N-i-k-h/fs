const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    broker: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    request: { type: mongoose.Schema.Types.ObjectId, ref: 'Request', required: true },
    type: { type: String, enum: ['rfp_details', 'client_details'], required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    paymentId: { type: String }, // Razorpay Payment ID
    orderId: { type: String },   // Razorpay Order ID
    status: { type: String, enum: ['pending', 'captured', 'failed'], default: 'pending' },
    paymentDate: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);
