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
        let space;

        // Check if the ID provided is numeric (our custom ID)
        if (!isNaN(req.params.id)) {
            space = await Space.findOne({ id: req.params.id });
        }

        // If not found by numeric ID, check if it's a valid MongoDB ObjectId
        if (!space && req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
            space = await Space.findById(req.params.id);
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
        console.log('Received POST request to create space');
        console.log('Request body:', JSON.stringify(req.body, null, 2));

        // Generate a random numeric ID if not provided (for legacy compatibility)
        const id = req.body.id || Math.floor(1000 + Math.random() * 9000);
        const newSpace = new Space({ ...req.body, id });

        console.log('Attempting to save space with ID:', id);
        const savedSpace = await newSpace.save();
        console.log('Space saved successfully:', savedSpace._id);

        res.status(201).json(savedSpace);
    } catch (err) {
        console.error('Error creating space:', err);
        console.error('Error name:', err.name);
        console.error('Error message:', err.message);
        if (err.errors) {
            console.error('Validation errors:', err.errors);
        }
        res.status(400).json({ message: err.message, errors: err.errors });
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
