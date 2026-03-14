const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');
const sendWelcomeEmail = require('../utils/sendWelcomeEmail');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Consistent Secret Management
const JWT_SECRET = process.env.JWT_SECRET || 'flickspace_secret_key_123_abc';

// Register
router.post('/register', async (req, res) => {
    try {
        const { name, password, role } = req.body;
        const email = req.body.email.toLowerCase();
        console.log('📝 New Registration Request:', { email, role });

        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ msg: 'User already exists' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = new User({
            name,
            email,
            password: hashedPassword,
            role: role || 'user'
        });

        await user.save();
        console.log('✅ User Saved Successfully:', user.email);

        // Send Welcome Email (Non-blocking)
        sendWelcomeEmail(user.email, user.name).catch(e => console.error('📧 Email Error:', e));

        const payload = { user: { id: user.id, role: user.role, name: user.name } };
        jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' }, (err, token) => {
            if (err) throw err;
            res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
        });
    } catch (err) {
        console.error('❌ Registration Error:', err.message);
        res.status(500).send('Server error');
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const email = req.body.email.toLowerCase();
        const password = req.body.password;
        console.log('🔑 Login Attempt:', email);

        let user = await User.findOne({ email });
        if (!user) {
            console.log('👤 User Not Found:', email);
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        // --- ENFORCE SEPARATION ---
        if (user.role === 'broker') {
            return res.status(403).json({
                msg: 'This portal is for Clients only. Please login via the Partner Portal.',
                isBroker: true
            });
        }

        if (!user.password) {
            console.log('🚫 Google User attempted password login:', email);
            return res.status(400).json({ msg: 'Please login with Google' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log('🚫 Password Mismatch for:', email);
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const payload = { user: { id: user.id, role: user.role, name: user.name } };
        jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' }, (err, token) => {
            if (err) throw err;
            res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
        });
    } catch (err) {
        console.error('❌ Login Error:', err.message);
        res.status(500).send('Server error');
    }
});

// Broker Login
router.post('/broker-login', async (req, res) => {
    try {
        const email = req.body.email.toLowerCase();
        const password = req.body.password;
        console.log('🏢 Broker Login Attempt:', email);

        let user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: 'Invalid Credentials' });

        if (user.role !== 'broker' && user.role !== 'admin') {
            return res.status(403).json({ msg: 'Access denied. You are not registered as a partner.' });
        }

        if (!user.password) return res.status(400).json({ msg: 'Please login with Google' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: 'Invalid Credentials' });

        const payload = { user: { id: user.id, role: user.role, name: user.name } };
        jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' }, (err, token) => {
            if (err) throw err;
            res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
        });
    } catch (err) {
        console.error('❌ Broker Login Error:', err.message);
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
            if (!user.googleId) {
                user.googleId = sub;
                if (!user.avatar) user.avatar = picture;
                await user.save();
            }
        } else {
            user = new User({ name, email, googleId: sub, avatar: picture, role: 'user' });
            await user.save();
            sendWelcomeEmail(user.email, user.name).catch(e => console.error(e));
        }

        const payload = { user: { id: user.id, role: user.role, name: user.name } };
        jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' }, (err, token) => {
            if (err) throw err;
            res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role, avatar: user.avatar } });
        });
    } catch (err) {
        console.error('❌ Google Auth Error:', err);
        res.status(401).send('Google authentication failed');
    }
});

// Google Auth (Raw)
router.post('/google-data', async (req, res) => {
    try {
        const { element } = req.body;
        const { name, email, picture, sub, id } = element;
        const googleId = sub || id;

        let user = await User.findOne({ email });

        if (user) {
            // --- ENFORCE SEPARATION ---
            if (user.role === 'broker') {
                return res.status(403).json({
                    msg: 'This account is registered as a Partner. Please login via the Partner Portal.',
                    isBroker: true
                });
            }
            if (!user.googleId) {
                user.googleId = googleId;
                if (!user.avatar) user.avatar = picture;
                await user.save();
            }
        } else {
            user = new User({ name, email, googleId, avatar: picture, role: 'user' });
            await user.save();
            sendWelcomeEmail(user.email, user.name).catch(e => console.error(e));
        }

        const payload = { user: { id: user.id, role: user.role, name: user.name } };
        jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' }, (err, token) => {
            if (err) throw err;
            res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role, avatar: user.avatar } });
        });
    } catch (err) {
        console.error('❌ Google Data Error:', err);
        res.status(500).send('Server Error');
    }
});

// Get Current User
router.get('/me', async (req, res) => {
    try {
        const token = req.header('x-auth-token');
        if (!token || token === 'undefined' || token === 'null') {
            return res.status(401).json({ msg: 'No token' });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.user.id).select('-password');
        if (!user) return res.status(404).json({ msg: 'User not found' });
        res.json(user);
    } catch (err) {
        console.error('🔍 Token Verification Failed:', err.message);
        res.status(401).json({ msg: 'Token is not valid' });
    }
});

module.exports = router;
