const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');
const sendWelcomeEmail = require('../utils/sendWelcomeEmail');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Register
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ msg: 'User already exists' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = new User({
            name,
            email,
            password: hashedPassword,
            role: 'user'
        });

        await user.save();

        // Send Welcome Email
        console.log('📝 Registering new user:', user.email);
        try {
            await sendWelcomeEmail(user.email, user.name);
            console.log('📧 Email trigger sent for:', user.email);
        } catch (emailErr) {
            console.error('⚠️ Email trigger failed:', emailErr);
        }

        const payload = { user: { id: user.id, role: user.role, name: user.name } };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' }, (err, token) => {
            if (err) throw err;
            res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        let user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: 'Invalid Credentials' });

        // If user was created via Google, they might not have a password
        if (!user.password) return res.status(400).json({ msg: 'Please login with Google' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: 'Invalid Credentials' });

        const payload = { user: { id: user.id, role: user.role, name: user.name } };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' }, (err, token) => {
            if (err) throw err;
            res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Google Auth
router.post('/google', async (req, res) => {
    try {
        const { token } = req.body;
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID
        });
        const { name, email, picture, sub } = ticket.getPayload();

        let user = await User.findOne({ email });

        if (user) {
            // Update googleId if not present (merging account)
            if (!user.googleId) {
                user.googleId = sub;
                if (!user.avatar) user.avatar = picture;
                await user.save();
                console.log('📝 Google Sync (Merged Account):', user.email);
            } else {
                console.log('📝 Google Sync (Existing User - No Email):', user.email);
            }
        } else {
            // Create new user
            user = new User({
                name,
                email,
                googleId: sub,
                avatar: picture,
                role: 'user'
            });
            await user.save();
            console.log('📝 Google Sync (New User):', user.email);
            try {
                await sendWelcomeEmail(user.email, user.name);
                console.log('📧 Email trigger sent for:', user.email);
            } catch (e) { console.error('⚠️ Email trigger failed:', e); }
        }

        const payload = { user: { id: user.id, role: user.role, name: user.name } };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' }, (err, token) => {
            if (err) throw err;
            res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role, avatar: user.avatar } });
        });

    } catch (err) {
        console.error('Google Auth Error:', err);
        res.status(401).send('Google authentication failed');
    }
});

// Google Auth (Raw Data from Frontend)
router.post('/google-data', async (req, res) => {
    try {
        const { element } = req.body; // Expecting profile object
        const { name, email, picture, sub, id } = element;
        const googleId = sub || id;

        let user = await User.findOne({ email });

        if (user) {
            if (!user.googleId) {
                user.googleId = googleId;
                if (!user.avatar) user.avatar = picture;
                await user.save();
            }
        } else {
            user = new User({
                name,
                email,
                googleId: googleId,
                avatar: picture,
                role: 'user'
            });
            await user.save();
            console.log('📝 Google Data Sync (New User):', user.email);
            try {
                await sendWelcomeEmail(user.email, user.name);
                console.log('📧 Email trigger sent for:', user.email);
            } catch (e) { console.error('⚠️ Email trigger failed:', e); }
        }

        const payload = { user: { id: user.id, role: user.role, name: user.name } };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' }, (err, token) => {
            if (err) throw err;
            res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role, avatar: user.avatar } });
        });
    } catch (err) {
        console.error('Google Data Auth Error:', err);
        res.status(500).send('Server Error');
    }
});

// Get Current User (for persistence)
router.get('/me', async (req, res) => {
    try {
        const token = req.header('x-auth-token');
        if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.user.id).select('-password');
        res.json(user);
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
});

module.exports = router;
