const express = require('express');
const router = express.Router();
const Request = require('../models/Request');

const sendTourEmail = require('../utils/sendTourEmail');

const Space = require('../models/Space');
const sendBookingConfirmationEmail = require('../utils/sendBookingConfirmationEmail');
const Proposal = require('../models/Proposal');
const User = require('../models/User');
const sendRFPApprovalEmail = require('../utils/sendRFPApprovalEmail');
const sendRFPSubmissionEmail = require('../utils/sendRFPSubmissionEmail');
const sendHandshakeEmail = require('../utils/sendHandshakeEmail');
const sendProposalNotificationEmail = require('../utils/sendProposalNotificationEmail');
const sendQuoteNotificationEmail = require('../utils/sendQuoteNotificationEmail');

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
        const pendingCount = await Request.countDocuments({ status: 'pending', type: { $ne: 'Detailed RFP' } });
        const rfpCount = await Request.countDocuments({ type: 'Detailed RFP', status: 'pending' });

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
            rfpCount,
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

// Create New Quote / Brochure Download Request
router.post('/quote', async (req, res) => {
    try {
        const { fullName, email, phone, seats, budget, timeline, micromarket, spaceName, spaceId } = req.body;

        const newRequest = new Request({
            user: fullName,
            email,
            phone,
            space: spaceName, // or spaceId if you prefer
            spaceName, // keeping consistency
            seats: seats ? Number(seats) : undefined,
            budget,
            timeline,
            micromarket,
            type: 'Quote Request',
            status: 'pending',
            isBrochureDownloaded: true, // Since this comes from GetQuotePage which downloads brochure
        });

        await newRequest.save();
        console.log('📝 Quote Request Saved:', spaceName, 'by', fullName);

        // Send email notification to Admin
        await sendQuoteNotificationEmail({
            user: fullName,
            email,
            phone,
            space: spaceName,
            seats,
            budget,
            timeline,
            micromarket
        });

        res.status(201).json({ message: 'Quote requested successfully', request: newRequest });
    } catch (err) {
        console.error('❌ Quote Request Error:', err);
        res.status(500).send('Server Error');
    }
});

// Create New Handshake Request
router.post('/handshake', async (req, res) => {
    try {
        const { user, email, phone, space, seats, budget, timeline, details } = req.body;

        const newRequest = new Request({
            user,
            email,
            phone,
            space,
            seats,
            budget,
            timeline,
            details,
            status: 'pending',
            type: 'Handshake'
        });

        await newRequest.save();
        console.log('🤝 Handshake Initiated:', space, 'by', user);

        // Send Email to Admin
        await sendHandshakeEmail({ user, email, phone, space, seats, budget, timeline });

        res.status(201).json({ message: 'Handshake initiated successfully', request: newRequest });
    } catch (err) {
        console.error('❌ Handshake Request Error:', err);
        res.status(500).send('Server Error');
    }
});

// Get All Handshakes for Admin (with Broker Details)
router.get('/admin-handshakes', async (req, res) => {
    try {
        const handshakes = await Request.aggregate([
            { $match: { type: 'Handshake' } },
            {
                $lookup: {
                    from: 'spaces',
                    localField: 'space',
                    foreignField: 'name',
                    as: 'spaceInfo'
                }
            },
            { $unwind: { path: '$spaceInfo', preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: 'users',
                    let: { ownerId: '$spaceInfo.owner' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $or: [
                                        { $eq: ['$_id', '$$ownerId'] },
                                        {
                                            $and: [
                                                { $eq: [{ $type: '$$ownerId' }, 'string'] },
                                                { $regexMatch: { input: '$$ownerId', regex: /^[0-9a-fA-F]{24}$/ } },
                                                { $eq: ['$_id', { $toObjectId: '$$ownerId' }] }
                                            ]
                                        },
                                        { $eq: ['$email', '$$ownerId'] }
                                    ]
                                }
                            }
                        }
                    ],
                    as: 'brokerInfo'
                }
            },
            { $unwind: { path: '$brokerInfo', preserveNullAndEmptyArrays: true } },
            { $sort: { createdAt: -1 } }
        ]);

        res.json(handshakes);
    } catch (err) {
        console.error('❌ Admin Handshake Error:', err);
        res.status(500).send('Server Error');
    }
});

// Create New Detailed RFP
router.post('/rfp', async (req, res) => {
    const traceId = Math.random().toString(36).substring(7);
    console.log(`[RFP-TRACE-${traceId}] 📬 Request Received`);
    try {
        const { formData, email, user } = req.body;

        if (!formData) {
            console.error(`[RFP-TRACE-${traceId}] ❌ No formData found in body`);
            return res.status(400).json({ message: 'Missing form data' });
        }

        const requestPayload = {
            user: user || formData.clientName || 'Anonymous User',
            email: email || formData.decisionMakerEmail || 'anonymous@flickspace.com',
            phone: formData.phone || formData.adminSpocEmail || 'N/A',
            companyName: formData.companyName || 'Confidential Company',
            clientName: formData.clientName || 'Anonymous',
            space: 'Detailed Requirement',
            seats: Number(formData.totalSeats) || 0,
            budget: `${formData.budgetRange || 'TBD'} ${formData.budgetType ? '(' + formData.budgetType + ')' : ''}`,
            timeline: formData.expectedMoveIn || 'Flexible',
            micromarket: formData.preferredLocation || 'Not Specified',
            type: 'Detailed RFP',
            status: 'pending',
            details: formData
        };

        console.log(`[RFP-TRACE-${traceId}] 💾 Attempting to save to DB...`);
        const newRequest = new Request(requestPayload);
        const saved = await newRequest.save();

        // Send Email Notification
        await sendRFPSubmissionEmail(requestPayload);

        console.log(`[RFP-TRACE-${traceId}] ✅ Saved Successfully: ${saved._id}`);

        res.status(201).json({
            message: 'RFP created successfully',
            request: saved,
            traceId
        });
    } catch (err) {
        console.error(`[RFP-TRACE-${traceId}] ❌ ERROR:`, err.message);
        console.error(err.stack);

        // Return a very explicit error object
        res.status(500).json({
            message: 'Server-side failure during RFP creation',
            error: err.message,
            stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
            traceId
        });
    }
});


// --- Proposal & RFP Approval Flow ---

// 1. Submit Proposal (Broker)
router.post('/proposal', async (req, res) => {
    try {
        const { rfpId, brokerId, spaceId, message } = req.body;
        const newProposal = new Proposal({
            rfpId,
            brokerId,
            spaceId,
            message,
            status: 'pending'
        });
        await newProposal.save();

        // Notify Admin about new proposal
        const proposalWithDetails = await Proposal.findById(newProposal._id)
            .populate('rfpId')
            .populate('brokerId')
            .populate('spaceId');

        if (proposalWithDetails) {
            await sendProposalNotificationEmail({
                rfp: proposalWithDetails.rfpId,
                broker: proposalWithDetails.brokerId,
                space: proposalWithDetails.spaceId,
                message: proposalWithDetails.message
            });
        }

        res.status(201).json(newProposal);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// 2. Get All Proposals for Admin
router.get('/proposals/admin', async (req, res) => {
    try {
        const proposals = await Proposal.find()
            .populate('rfpId')
            .populate('brokerId', 'name email phone')
            .populate('spaceId', 'name location city price')
            .sort({ createdAt: -1 });
        res.json(proposals);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// 3. Approve Proposal (Admin)
router.put('/proposal/:id/approve', async (req, res) => {
    try {
        const proposal = await Proposal.findById(req.params.id)
            .populate('rfpId')
            .populate('brokerId')
            .populate('spaceId');

        if (!proposal) return res.status(404).send('Proposal not found');

        proposal.status = 'approved';
        await proposal.save();

        // Update the original RFP status
        if (proposal.rfpId) {
            const rfp = await Request.findById(proposal.rfpId._id);
            if (rfp) {
                rfp.status = 'approved';
                await rfp.save();
            }
        }

        // Send Email with PDF
        await sendRFPApprovalEmail({
            rfp: proposal.rfpId,
            space: proposal.spaceId,
            broker: proposal.brokerId
        });

        res.json({ message: 'Proposal approved and emails sent', proposal });
    } catch (err) {
        console.error('Approve Proposal Error:', err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
