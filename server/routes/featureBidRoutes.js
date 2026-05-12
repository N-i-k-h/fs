const express = require('express');
const router = express.Router();
const FeatureBid = require('../models/FeatureBid');
const auth = require('../middleware/auth');
const Space = require('../models/Space');

// Public: Get featured spaces
router.get('/featured', async (req, res) => {
    try {
        const paidBids = await FeatureBid.find({ status: 'paid' }).populate('spaceId');
        const spaces = [];
        const seen = new Set();
        for (const bid of paidBids) {
            if (bid.spaceId && !seen.has(bid.spaceId._id.toString())) {
                spaces.push(bid.spaceId);
                seen.add(bid.spaceId._id.toString());
            }
        }
        res.json(spaces);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Partner: Create a new bid
router.post('/', auth, async (req, res) => {
    try {
        const { spaceId, bidAmount } = req.body;
        const newBid = new FeatureBid({
            partnerId: req.user.id,
            spaceId,
            bidAmount
        });
        await newBid.save();
        res.status(201).json(newBid);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Partner: Get their own bids
router.get('/my-bids', auth, async (req, res) => {
    try {
        const bids = await FeatureBid.find({ partnerId: req.user.id }).populate('spaceId');
        res.json(bids);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Admin: Get all bids
router.get('/all', async (req, res) => {
    try {
        const bids = await FeatureBid.find().populate('spaceId').populate('partnerId', 'name email companyName');
        res.json(bids);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Admin: Update bid status (accept/reject)
router.put('/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        const bid = await FeatureBid.findByIdAndUpdate(req.params.id, { status }, { new: true });
        res.json(bid);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Partner: Pay for accepted bid
router.put('/:id/pay', auth, async (req, res) => {
    try {
        const bid = await FeatureBid.findByIdAndUpdate(req.params.id, { status: 'paid' }, { new: true });
        if (bid && bid.spaceId) {
            await Space.findByIdAndUpdate(bid.spaceId, { isFeatured: true });
        }
        res.json(bid);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
