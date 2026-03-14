require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const path = require('path');
const fs = require('fs');

// Import Cloudinary configuration
const { upload } = require('./utils/cloudinary');
const cloudinary = require('cloudinary').v2;
console.log('Cloudinary Config Check:', {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY ? 'Present' : 'Missing',
    api_secret: process.env.CLOUDINARY_API_SECRET ? 'Present' : 'Missing'
});
const multer = require('multer');

// Ensure uploads directory exists (for backward compatibility if needed)
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}


// Middleware
app.use(cors());
app.use(express.json());

// Serve uploaded files statically - MUST be before other routes
const uploadsPath = path.join(__dirname, 'uploads');
app.use('/uploads', express.static(uploadsPath));
console.log('Serving uploads from:', uploadsPath);

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/spaces', require('./routes/spaceRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/requests', require('./routes/requestRoutes'));
app.use('/api/broker', require('./routes/brokerRoutes'));

// Upload Route (Cloudinary with Local Fallback)
const { isCloudinaryConfigured } = require('./utils/cloudinary');

app.post('/api/upload', upload.single('image'), (req, res) => {
    try {
        console.log('Upload request received');
        if (!req.file) {
            console.error('No file in request');
            return res.status(400).json({ message: 'No file uploaded' });
        }

        let fileUrl;
        if (isCloudinaryConfigured) {
            // Cloudinary URL is stored in req.file.path
            fileUrl = req.file.path;
        } else {
            // Local file URL
            fileUrl = `/uploads/${req.file.filename}`;
        }

        console.log('Upload successful:', fileUrl);

        res.status(200).json({
            url: fileUrl,
            public_id: req.file.filename
        });
    } catch (err) {
        console.error("Upload Error:", err);
        res.status(500).json({
            message: 'Server upload error',
            error: err.message
        });
    }
});

// Error handling middleware for multer
app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        console.error('Multer Error:', err);
        return res.status(400).json({
            message: 'File upload error',
            error: err.message
        });
    } else if (err) {
        console.error('Server Error:', err);
        return res.status(500).json({
            message: 'Server error',
            error: err.message
        });
    }
    next();
});

// Database Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log('MongoDB Connection Use Error:', err));

const PORT = process.env.PORT || 5000;

// Serve Static Frontend Assets (Production)
// This assumes the frontend is built into the 'dist' folder at the project root
app.use(express.static(path.join(__dirname, '../dist')));

// Handle Client-side Routing
// Return index.html for any route not handled by the API above
app.get(/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, '../dist', 'index.html'));
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
