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

const bcrypt = require('bcryptjs');
const { notifyAdminOfActivity } = require('../utils/emailService');

// Change Password
router.put('/change-password', auth, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ msg: 'User not found' });

        // Google users might not have a password
        if (user.password) {
            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) return res.status(400).json({ msg: 'Incorrect current password' });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();

        // Notify Admin of Password Reset
        notifyAdminOfActivity(user.email, user.name, 'Password Reset').catch(e => console.error(e));

        res.json({ msg: 'Password updated successfully' });
    } catch (err) {
        console.error('Password Update Error:', err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
