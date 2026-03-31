const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const auth = require('../middleware/auth');
const Payment = require('../models/Payment');
const Request = require('../models/Request');
const User = require('../models/User');
const sendPaymentSuccessEmail = require('../utils/sendPaymentSuccessEmail');

const getRazorpay = () => {
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
        throw new Error('Razorpay API keys are missing from environment');
    }
    return new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET
    });
};

// Create Order (for ₹1)
router.post('/create-order', auth, async (req, res) => {
    try {
        // Keys are checked inside getRazorpay()
        const { requestId, type } = req.body; // type: 'rfp_details' or 'client_details'
        console.log(`💳 Creating Razorpay Order for RFP: ${requestId}, Type: ${type}`);
        
        if (!requestId) {
            console.error('❌ Missing Request ID for payment order');
            return res.status(400).json({ msg: 'Request ID is required' });
        }

        const amount = 100; // ₹1 in paise

        const options = {
            amount: amount,
            currency: "INR",
            receipt: `rcpt_${crypto.randomBytes(4).toString('hex')}`
        };

        const razorpay = getRazorpay();
        const order = await razorpay.orders.create(options);
        res.json(order);
    } catch (err) {
        const errorDetail = {
            timestamp: new Date().toISOString(),
            message: err.message,
            stack: err.stack,
            body: req.body,
            env: {
                hasKey: !!process.env.RAZORPAY_KEY_ID,
                keyPrefix: process.env.RAZORPAY_KEY_ID ? process.env.RAZORPAY_KEY_ID.substring(0, 8) : 'none',
                hasSecret: !!process.env.RAZORPAY_KEY_SECRET
            }
        };
        require('fs').appendFileSync('payment_errors.log', JSON.stringify(errorDetail, null, 2) + '\n');
        console.error('Razorpay Order Error Details:', errorDetail);
        res.status(500).json({ 
            msg: 'Razorpay order creation failed', 
            error: err.message,
            stack: err.stack,
            code: err.code
        });
    }
});

// Verify Payment
router.post('/verify-payment', auth, async (req, res) => {
    try {
        const { 
            razorpay_order_id, 
            razorpay_payment_id, 
            razorpay_signature,
            requestId,
            type
        } = req.body;

        const sign = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSign = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(sign.toString())
            .digest("hex");

        if (razorpay_signature === expectedSign) {
            // Payment Success - Save to DB
            const newPayment = new Payment({
                broker: req.user.id,
                request: requestId,
                type: type,
                amount: 1, // INR
                paymentId: razorpay_payment_id,
                orderId: razorpay_order_id,
                status: 'captured'
            });

            await newPayment.save();

            // Trigger Email to Broker about success and next steps
            const user = await User.findById(req.user.id);
            if (user) {
                sendPaymentSuccessEmail(user.email, user.name, requestId, type).catch(e => console.error(e));
            }

            return res.json({ msg: "Payment verified successfully", success: true });
        } else {
            return res.status(400).json({ msg: "Invalid payment signature", success: false });
        }
    } catch (err) {
        console.error('Payment Verification Error:', err);
        res.status(500).send('Server Error');
    }
});

// Test Unlock (BYPASS RAZORPAY - FOR TESTING ONLY)
router.post('/test-unlock', auth, async (req, res) => {
    try {
        const { requestId, type } = req.body;
        console.log(`🧪 TEST UNLOCK: RFP: ${requestId}, Type: ${type}`);

        const newPayment = new Payment({
            broker: req.user.id,
            request: requestId,
            type: type,
            amount: 0,
            paymentId: `TEST_${Date.now()}`,
            orderId: `ORDER_TEST_${Date.now()}`,
            status: 'captured'
        });

        await newPayment.save();

        // Optional: Trigger Email to Broker about success and next steps
        const user = await User.findById(req.user.id);
        if (user) {
            sendPaymentSuccessEmail(user.email, user.name, requestId, type).catch(e => console.error(e));
        }

        res.json({ msg: "Lead unlocked for testing!", success: true });
    } catch (err) {
        console.error('Test Unlock Error:', err);
        res.status(500).json({ msg: "Test unlock failed", error: err.message });
    }
});

// Check Payment Status for a Request
router.get('/status/:requestId', auth, async (req, res) => {
    try {
        const payments = await Payment.find({
            broker: req.user.id,
            request: req.params.requestId,
            status: 'captured'
        });

        res.json({
            hasPaidRFP: payments.some(p => p.type === 'rfp_details'),
            hasPaidClient: payments.some(p => p.type === 'client_details')
        });
    } catch (err) {
        console.error('Check Payment Status Error:', err);
        res.status(500).send('Server Error');
    }
});

// Get All Payments for Admin
router.get('/admin-payments', async (req, res) => {
    try {
        const payments = await Payment.find({ status: 'captured' })
            .populate('broker', 'name email phone role')
            .populate('request', 'companyName user email type')
            .sort({ createdAt: -1 });

        res.json(payments);
    } catch (err) {
        console.error('Fetch Admin Payments Error:', err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
