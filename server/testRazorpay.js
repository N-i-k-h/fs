const Razorpay = require('razorpay');
require('dotenv').config();

const testRazorpay = async () => {
    try {
        console.log('🚀 Testing Razorpay Order Creation...');
        const razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        });

        const order = await razorpay.orders.create({
            amount: 100, // ₹1
            currency: "INR",
            receipt: "test_receipt_001"
        });

        console.log('✅ Razorpay ORDER SUCCESS:', order.id);
    } catch (err) {
        console.error('❌ Razorpay ERROR:', err.message);
        if (err.error) console.error('Details:', err.error);
    }
};

testRazorpay();
