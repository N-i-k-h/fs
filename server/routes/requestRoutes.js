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
const Payment = require('../models/Payment');
const auth = require('../middleware/auth');

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

        // 5. Handshake Analytics
        const handshakeCount = await Proposal.countDocuments({ status: 'Handshake' });
        const proposalCount = await Proposal.countDocuments({});

        // 6. Corporate Revenue (RFP & Client Details)
        const payments = await Payment.find({ status: 'captured' });
        const corporateRevenue = payments.reduce((acc, p) => acc + (p.amount / 100), 0); // Convert paise to INR

        res.json({
            pendingCount,
            rfpCount,
            totalRevenue,
            chartData,
            recentActivity,
            handshakeCount,
            proposalCount,
            corporateRevenue
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

// Get All Handshakes for Admin (Unified)
router.get('/admin-handshakes', async (req, res) => {
    try {
        // 1. Get Direct Handshakes (Requests)
        const directHandshakes = await Request.aggregate([
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
                        { $match: { $expr: { $or: [{ $eq: ['$_id', '$$ownerId'] }, { $eq: ['$email', '$$ownerId'] }] } } }
                    ],
                    as: 'brokerInfo'
                }
            },
            { $unwind: { path: '$brokerInfo', preserveNullAndEmptyArrays: true } }
        ]);

        // 2. Get Proposal Handshakes (Proposals)
        const proposalHandshakes = await Proposal.find({ status: 'Handshake' })
            .populate('rfpId')
            .populate('brokerId')
            .populate('spaceId');

        // 3. Format Proposal Handshakes to match the Direct Handshake schema
        const formattedProposals = proposalHandshakes.map(p => ({
            _id: p._id,
            user: p.rfpId?.clientName || p.rfpId?.user || 'Unknown',
            email: p.rfpId?.email,
            phone: p.rfpId?.phone,
            seats: p.rfpId?.seats,
            timeline: p.rfpId?.timeline,
            space: p.spaceId?.name,
            spaceInfo: p.spaceId,
            brokerInfo: p.brokerId,
            isProposal: true,
            createdAt: p.createdAt
        }));

        // 4. Combine and Sort
        const allHandshakes = [...directHandshakes, ...formattedProposals].sort((a, b) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        res.json(allHandshakes);
    } catch (err) {
        console.error('Fetch Unified Handshakes Error:', err);
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
            micromarket: formData.region || formData.preferredLocation || 'Not Specified',
            type: 'Detailed RFP',
            status: 'pending',
            details: formData
        };

        console.log(`[RFP-TRACE-${traceId}] 💾 Attempting to save to DB...`);
        const newRequest = new Request(requestPayload);
        const saved = await newRequest.save();

        // 🚀 BROADCAST TO ALL BROKERS: Find ALL brokers to notify
        let brokerEmails = [];
        try {
            const brokers = await User.find({ role: 'broker' });
            brokerEmails = brokers.map(b => b.email);
            
            if (brokerEmails.length > 0) {
                console.log(`[RFP-TRACE-${traceId}] 🎯 Broadcasting to ${brokerEmails.length} brokers`);
            }
        } catch (err) {
            console.error(`[RFP-TRACE-${traceId}] ⚠️ Broker matching failed:`, err.message);
        }

        // 📧 SEND NOTIFICATIONS (Async Fallback)
        try {
            await sendRFPSubmissionEmail(requestPayload, brokerEmails);
            console.log(`[RFP-TRACE-${traceId}] 📧 Notifications dispatched`);
        } catch (emailErr) {
            console.warn(`[RFP-TRACE-${traceId}] ⚠️ Email alert failed, but RFP is safe:`, emailErr.message);
            // We do NOT return a 500 here, as the entity is already saved.
        }

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

// 4. Get Proposals for Client (proposals for their RFPs)
router.get('/proposals/client/:email', async (req, res) => {
    try {
        // 1. Find all RFPs for this client
        const myRfps = await Request.find({ email: req.params.email, type: { $in: ['RFP', 'Detailed RFP'] } });
        const rfpIds = myRfps.map(r => r._id);

        // 2. Find all proposals for these RFPs
        const proposals = await Proposal.find({ rfpId: { $in: rfpIds } })
            .populate('rfpId')
            .populate('brokerId', 'name email phone avatar')
            .populate('spaceId', 'name location city price images')
            .sort({ createdAt: -1 });

        res.json(proposals);
    } catch (err) {
        console.error('Fetch Client Proposals Error:', err);
        res.status(500).send('Server Error');
    }
});

// 5. Update Proposal Status (Client/Admin)
router.put('/proposal/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        const proposal = await Proposal.findById(req.params.id)
            .populate('rfpId')
            .populate('brokerId')
            .populate('spaceId');

        if (!proposal) return res.status(404).json({ message: 'Proposal not found' });

        proposal.status = status;
        await proposal.save();

        // If client selects "Handshake", notify admin/broker
        if (status === 'Handshake') {
            const handshakeDetails = {
                user: proposal.rfpId?.clientName || proposal.rfpId?.user || 'Client',
                email: proposal.rfpId?.email,
                phone: proposal.rfpId?.phone,
                space: proposal.spaceId?.name,
                seats: proposal.rfpId?.seats,
                budget: proposal.rfpId?.budget,
                timeline: proposal.rfpId?.timeline
            };

            // Notify Admin
            await sendHandshakeEmail(handshakeDetails);

            // Notify Broker
            if (proposal.brokerId?.email) {
                await sendHandshakeEmail({
                    ...handshakeDetails,
                    to: proposal.brokerId.email
                });
            }
        }

        res.json(proposal);
    } catch (err) {
        console.error('Update Proposal Status Error:', err);
        res.status(500).send('Server Error');
    }
});

// 6. Get Proposals for Broker (proposals they submitted)
router.get('/proposals/broker/:brokerId', async (req, res) => {
    try {
        const proposals = await Proposal.find({ brokerId: req.params.brokerId })
            .populate('rfpId')
            .populate('spaceId', 'name location city price images')
            .sort({ createdAt: -1 });
        res.json(proposals);
    } catch (err) {
        console.error('Fetch Broker Proposals Error:', err);
        res.status(500).send('Server Error');
    }
});


// Get RFP Details for Broker (Filtered by Payment)
router.get('/rfp/:id/details', auth, async (req, res) => {
    try {
        const rfp = await Request.findById(req.params.id);
        if (!rfp) return res.status(404).json({ msg: 'RFP not found' });

        const payments = await Payment.find({
            broker: req.user.id,
            request: rfp._id,
            status: 'captured'
        });

        const hasPaidRFP = payments.some(p => p.type === 'rfp_details');
        const hasPaidClient = payments.some(p => p.type === 'client_details');

        if (!hasPaidRFP) {
            return res.status(200).json({ 
                msg: 'Payment required for RFP details', 
                needsPayment: true,
                hasPaidRFP: false,
                hasPaidClient: false 
            });
        }

        // Base RFP Specs (Always available after 1st payment)
        const responseData = {
            _id: rfp._id,
            type: rfp.type,
            status: rfp.status,
            createdAt: rfp.createdAt,
            // Specs
            seats: rfp.seats,
            budget: rfp.budget,
            timeline: rfp.timeline,
            micromarket: rfp.micromarket,
            companyName: rfp.companyName,
            details: rfp.details, // This contains the infrastructure specs
            hasPaidRFP: true,
            hasPaidClient: hasPaidClient
        };

        // Add Client Details only if 2nd payment is made
        if (hasPaidClient) {
            responseData.clientName = rfp.clientName || rfp.user;
            responseData.email = rfp.email;
            responseData.phone = rfp.phone;
        }

        res.json(responseData);
    } catch (err) {
        console.error('Fetch RFP Details Error:', err);
        res.status(500).send('Server Error');
    }
});

// Get Requests for Broker Hub (Masked)
router.get('/broker-hub', auth, async (req, res) => {
    try {
        const requests = await Request.find({ type: 'Detailed RFP' }).sort({ createdAt: -1 });
        
        // Fetch all payments for this broker
        const payments = await Payment.find({
            broker: req.user.id,
            status: 'captured'
        });

        // Mask companyName if not paid
        const maskedRequests = requests.map(req => {
            const hasPaidRFP = payments.some(p => p.request.toString() === req._id.toString() && p.type === 'rfp_details');
            const hasPaidClient = payments.some(p => p.request.toString() === req._id.toString() && p.type === 'client_details');
            
            const reqObj = req.toObject();
            if (!hasPaidClient) {
                reqObj.companyName = "[CONFIDENTIAL - PAY TO UNLOCK]";
                reqObj.clientName = "[LOCKED]";
                reqObj.email = "[LOCKED]";
                reqObj.phone = "[LOCKED]";
            }
            return reqObj;
        });

        res.json(maskedRequests);
    } catch (err) {
        console.error('Broker Hub Error:', err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;

