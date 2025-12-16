require('dotenv').config();
const sendWelcomeEmail = require('./utils/sendWelcomeEmail');

console.log('--- TEST: API Sending from verified sender ---');
// Ensure API key is available
if (!process.env.BREVO_API_KEY && !process.env.BREVO_SMTP_PASS) {
    console.error('❌ Missing API Key in .env');
    process.exit(1);
}

sendWelcomeEmail(
    'nkashyappp18@gmail.com',
    'Nikhil Test'
);
