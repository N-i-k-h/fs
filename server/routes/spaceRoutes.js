const express = require('express');
const router = express.Router();
const Space = require('../models/Space');
const auth = require('../middleware/auth');

// Get All Spaces
router.get('/', async (req, res) => {
    try {
        const { city, type, ownerId } = req.query;
        let query = {};
        if (city) query.city = city;
        if (type) query.type = type;
        if (ownerId) query.owner = ownerId;

        const spaces = await Space.find(query).populate('owner', 'name email');
        res.json(spaces);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get My Spaces (Broker/Owner)
router.get('/my-spaces', auth, async (req, res) => {
    try {
        const spaces = await Space.find({ owner: req.user.id });
        res.json(spaces);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get Single Space
router.get('/:id', async (req, res) => {
    try {
        let space;
        if (!isNaN(req.params.id)) {
            space = await Space.findOne({ id: req.params.id }).populate('owner', 'name email');
        }
        if (!space && req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
            space = await Space.findById(req.params.id).populate('owner', 'name email');
        }
        if (!space) return res.status(404).json({ message: 'Space not found' });
        res.json(space);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create New Space
router.post('/', auth, async (req, res) => {
    try {
        const id = req.body.id || Math.floor(1000 + Math.random() * 9000);
        const newSpace = new Space({
            ...req.body,
            id,
            owner: req.user.id // Set owner automatically from token
        });
        const savedSpace = await newSpace.save();
        res.status(201).json(savedSpace);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update Space (Admin)
router.put('/:id', async (req, res) => {
    try {
        let query;

        if (!isNaN(req.params.id)) {
            query = { id: req.params.id };
        } else if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
            query = { _id: req.params.id };
        } else {
            // Invalid ID format
            return res.status(400).json({ message: 'Invalid ID format' });
        }

        const updatedSpace = await Space.findOneAndUpdate(query, req.body, { new: true });
        if (!updatedSpace) return res.status(404).json({ message: 'Space not found' });
        res.json(updatedSpace);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Delete Space (Admin)
router.delete('/:id', async (req, res) => {
    try {
        let query;

        if (!isNaN(req.params.id)) {
            query = { id: req.params.id };
        } else if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
            query = { _id: req.params.id };
        } else {
            // Invalid ID format
            return res.status(400).json({ message: 'Invalid ID format' });
        }

        const deletedSpace = await Space.findOneAndDelete(query);
        if (!deletedSpace) return res.status(404).json({ message: 'Space not found' });
        res.json({ message: 'Space deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
