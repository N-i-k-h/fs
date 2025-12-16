const express = require('express');
const router = express.Router();
const Space = require('../models/Space');

// Get All Spaces
router.get('/', async (req, res) => {
    try {
        const spaces = await Space.find();
        res.json(spaces);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get Single Space
router.get('/:id', async (req, res) => {
    try {
        let space = await Space.findOne({ id: req.params.id });
        if (!space) {
            if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
                space = await Space.findById(req.params.id);
            }
        }
        if (!space) return res.status(404).json({ message: 'Space not found' });
        res.json(space);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create New Space (Admin)
router.post('/', async (req, res) => {
    try {
        // Generate a random numeric ID if not provided (for legacy compatibility)
        const id = req.body.id || Math.floor(1000 + Math.random() * 9000);
        const newSpace = new Space({ ...req.body, id });
        const savedSpace = await newSpace.save();
        res.status(201).json(savedSpace);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update Space (Admin)
router.put('/:id', async (req, res) => {
    try {
        // Handle update by custom numeric ID or Mongo ID
        let query = { id: req.params.id };
        if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
            query = { _id: req.params.id };
        } else if (isNaN(req.params.id)) {
            // If it's not a number and not an ObjectID, try _id again just in case or fail
            query = { _id: req.params.id };
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
        let query = { id: req.params.id };
        if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
            query = { _id: req.params.id };
        }

        const deletedSpace = await Space.findOneAndDelete(query);
        if (!deletedSpace) return res.status(404).json({ message: 'Space not found' });
        res.json({ message: 'Space deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
