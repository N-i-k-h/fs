const express = require('express');
const router = express.Router();
const Space = require('../models/Space');
const Request = require('../models/Request');
const Proposal = require('../models/Proposal');
const Payment = require('../models/Payment');
const auth = require('../middleware/auth');

// Get Broker Statistics
router.get('/stats', auth, async (req, res) => {
    try {
        if (!req.user || (req.user.role !== 'broker' && req.user.role !== 'admin')) {
            return res.status(403).json({ msg: 'Access denied' });
        }

        const brokerId = req.user.id;
        const mongoose = require('mongoose');
        const isValidId = mongoose.Types.ObjectId.isValid(brokerId);

        // 1. My Buildings
        const totalSpaces = isValidId ? await Space.countDocuments({ owner: brokerId }) : 0;

        // 2. Members Booked (Sum of seats in approved requests for my spaces)
        // First get all my space names
        const mySpaces = isValidId ? await Space.find({ owner: brokerId }).select('name') : [];
        const mySpaceNames = mySpaces.map(s => s.name);

        const approvedRequests = isValidId ? await Request.find({
            space: { $in: mySpaceNames },
            status: 'approved'
        }) : [];
        const totalBookings = approvedRequests.reduce((acc, curr) => acc + (curr.seats || 0), 0);

        // 3. Active Proposals/RFPs (Proposals sent by this broker)
        const activeProposals = isValidId ? await Proposal.countDocuments({ brokerId }) : 0;

        // 4. Handshakes (Direct handshakes + Successful proposal handshakes)
        const directHandshakesCount = mySpaceNames.length > 0 ? await Request.countDocuments({
            space: { $in: mySpaceNames },
            type: 'Handshake'
        }) : 0;
        const proposalHandshakesCount = isValidId ? await Proposal.countDocuments({ brokerId, status: 'Handshake' }) : 0;
        
        const totalHandshakes = directHandshakesCount + proposalHandshakesCount;

        res.json({
            totalSpaces,
            totalBookings,
            activeProposals,
            handshakes: totalHandshakes
        });
    } catch (err) {
        console.error('📊 Broker Stats Error:', err);
        res.status(500).send('Server Error');
    }
});

// Get Handshake Requests for Broker (Combined Direct and Proposal)
router.get('/handshakes', auth, async (req, res) => {
    try {
        if (!req.user || (req.user.role !== 'broker' && req.user.role !== 'admin')) {
            return res.status(403).json({ msg: 'Access denied' });
        }

        const brokerId = req.user.id;
        const mongoose = require('mongoose');
        const isValidId = mongoose.Types.ObjectId.isValid(brokerId);

        // 1. Fetch Direct Handshakes for my spaces
        const mySpaces = isValidId ? await Space.find({ owner: brokerId }).select('name') : [];
        const mySpaceNames = mySpaces.map(s => s.name);

        const directHandshakes = mySpaceNames.length > 0 ? await Request.find({
            space: { $in: mySpaceNames },
            type: 'Handshake'
        }).sort({ createdAt: -1 }) : [];

        // 2. Fetch Proposal Handshakes (Client accepted my bid)
        const proposalHandshakes = isValidId ? await Proposal.find({ 
            brokerId, 
            status: 'Handshake' 
        })
        .populate('rfpId')
        .populate('spaceId')
        .sort({ updatedAt: -1 }) : [];

        // 3. For Proposal Handshakes, check if they are paid for client details
        // and transform them to a similar structure as direct handshakes for the UI
        const payments = await Payment.find({
            broker: brokerId,
            status: 'captured'
        });

        const formattedProposals = proposalHandshakes.map(prop => {
            const hasPaidClient = payments.some(p => p.request.toString() === prop.rfpId._id.toString() && p.type === 'client_details');
            const rfp = prop.rfpId;
            
            return {
                _id: prop._id,
                rfpId: rfp._id,
                user: hasPaidClient ? (rfp.clientName || rfp.user) : "[CONFIDENTIAL]",
                email: hasPaidClient ? rfp.email : "[LOCKED]",
                phone: hasPaidClient ? rfp.phone : "[LOCKED]",
                space: prop.spaceId?.name || "Multiple Spaces",
                seats: rfp.seats,
                budget: rfp.budget,
                timeline: rfp.timeline,
                createdAt: prop.updatedAt,
                type: 'Proposal Handshake',
                needsPayment: !hasPaidClient,
                companyName: rfp.companyName
            };
        });

        const combinedHandshakes = [
            ...directHandshakes.map(h => ({ ...h.toObject(), type: 'Direct Handshake' })),
            ...formattedProposals
        ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        res.json(combinedHandshakes);
    } catch (err) {
        console.error('🤝 Broker Handshakes Error:', err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
