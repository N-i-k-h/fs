const express = require('express');
const router = express.Router();
const Space = require('../models/Space');
const Request = require('../models/Request');
const Proposal = require('../models/Proposal');
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

        // 4. Handshakes (Successful deals)
        const handshakes = isValidId ? await Proposal.countDocuments({ brokerId, status: 'Handshake' }) : 0;

        res.json({
            totalSpaces,
            totalBookings,
            activeProposals,
            handshakes
        });
    } catch (err) {
        console.error('📊 Broker Stats Error:', err);
        res.status(500).send('Server Error');
    }
});

// Get Handshake Requests for Broker
router.get('/handshakes', auth, async (req, res) => {
    try {
        if (!req.user || (req.user.role !== 'broker' && req.user.role !== 'admin')) {
            return res.status(403).json({ msg: 'Access denied' });
        }

        const brokerId = req.user.id;
        const mongoose = require('mongoose');
        const isValidId = mongoose.Types.ObjectId.isValid(brokerId);

        // Find all my spaces
        const mySpaces = isValidId ? await Space.find({ owner: brokerId }).select('name') : [];
        const mySpaceNames = mySpaces.map(s => s.name);

        // Find handshakes for these spaces
        const handshakes = mySpaceNames.length > 0 ? await Request.find({
            space: { $in: mySpaceNames },
            type: 'Handshake'
        }).sort({ createdAt: -1 }) : [];

        res.json(handshakes);
    } catch (err) {
        console.error('🤝 Broker Handshakes Error:', err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
