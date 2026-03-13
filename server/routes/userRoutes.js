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

const auth = require('../middleware/auth');

// Update User Profile
router.put('/profile', auth, async (req, res) => {
    try {
        const { name, phone, company } = req.body;
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ msg: 'User not found' });

        if (name) user.name = name;
        if (phone) user.phone = phone;
        if (company) user.company = company;

        await user.save();
        res.json(user);
    } catch (err) {
        console.error('Profile Update Error:', err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
