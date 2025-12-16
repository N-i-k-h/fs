const express = require('express');
const router = express.Router();
const Request = require('../models/Request');

const sendTourEmail = require('../utils/sendTourEmail');

const Space = require('../models/Space');
const sendBookingConfirmationEmail = require('../utils/sendBookingConfirmationEmail');

// Get Requests for specific user (by email)
router.get('/user/:email', async (req, res) => {
    try {
        const requests = await Request.find({ email: req.params.email }).sort({ createdAt: -1 });
        res.json(requests);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Get Analytics (Admin)
router.get('/analytics', async (req, res) => {
    try {
        // 1. Total Pending (for existing card)
        const pendingCount = await Request.countDocuments({ status: 'pending' });

        // 2. Approved Requests (for revenue calculation)
        const approvedRequests = await Request.find({ status: 'approved' });

        let totalRevenue = 0;
        // If we have totalAmount saved, use it. Otherwise, we might estimate 
        // (For now, we will rely on what is saved. Retrospective calculation is complex without reference)
        totalRevenue = approvedRequests.reduce((acc, req) => acc + (req.totalAmount || 0), 0);

        // 3. Monthly Booking Overview (Last 6 months)
        const monthlyData = {};
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        approvedRequests.forEach(req => {
            const date = new Date(req.createdAt);
            const key = months[date.getMonth()];
            monthlyData[key] = (monthlyData[key] || 0) + 1;
        });

        // Format for Recharts [{name: 'Jan', bookings: 10}, ...]
        const chartData = Object.keys(monthlyData).map(key => ({
            name: key,
            bookings: monthlyData[key]
        }));

        // 4. Recent Activity (Last 5 approved bookings)
        const recentActivity = await Request.find({ status: 'approved' })
            .sort({ updatedAt: -1 })
            .limit(5);

        res.json({
            pendingCount,
            totalRevenue,
            chartData,
            recentActivity
        });

    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Get ALL requests (Admin)
router.get('/', async (req, res) => {
    try {
        const requests = await Request.find().sort({ createdAt: -1 });
        res.json(requests);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Update Request Status
router.put('/:id/status', async (req, res) => {
    try {
        const { status } = req.body;

        // Find the request first
        const request = await Request.findById(req.params.id);
        if (!request) return res.status(404).send('Request not found');

        // Update status
        request.status = status;

        if (status === 'approved') {
            // Find the space to calculate price
            // Fallback for spaceName or space
            const spaceName = request.spaceName || request.space;
            const space = await Space.findOne({ name: spaceName });

            if (space) {
                // Calculate Total Price
                const pricePerSeat = space.price;
                const seats = request.seats || 1;
                const totalAmount = pricePerSeat * seats;
                request.totalAmount = totalAmount;

                // Send Confirmation Email
                const location = space.address || `${space.location}, ${space.city}`;
                const googleMapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location + " " + space.name)}`;

                // Execute Email Send (Async)
                sendBookingConfirmationEmail({
                    user: request.user,
                    email: request.email,
                    space: space.name,
                    seats: seats,
                    price: pricePerSeat,
                    date: request.date,
                    time: request.time,
                    totalAmount: totalAmount,
                    address: location,
                    googleMapsLink: googleMapsLink
                });
            } else {
                console.warn('⚠️ Space not found for price calculation:', spaceName);
                // Can still approve, but maybe price is 0 or uncalculated
            }
        }

        await request.save();
        res.json(request);
    } catch (err) {
        console.error('Update Status Error:', err);
        res.status(500).send('Server Error');
    }
});

// Create New Tour Request
router.post('/tour', async (req, res) => {
    try {
        const { user, email, phone, space, date, time, seats } = req.body;

        // Create new request document
        const newRequest = new Request({
            user,
            email,
            phone, // Ensure schema has this field or add it if strictly defined
            space,
            date,
            time,
            seats,
            status: 'pending',
            type: 'Tour Request'
        });

        await newRequest.save();
        console.log('📝 Tour Request Saved:', space, 'by', user);

        // Send Email Notification
        await sendTourEmail({ user, email, phone, space, date, time, seats });

        res.status(201).json({ message: 'Tour scheduled successfully', request: newRequest });
    } catch (err) {
        console.error('❌ Tour Request Error:', err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
