const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Get All Users (Admin) - Protected route logic can be added later
router.get('/', async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Get User Count
router.get('/count', async (req, res) => {
    try {
        const count = await User.countDocuments();
        res.json({ count });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

module.exports = router;
