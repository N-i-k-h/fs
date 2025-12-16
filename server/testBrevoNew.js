require('dotenv').config();
const sendWelcomeEmail = require('./utils/sendWelcomeEmail');

console.log('--- TEST: Sending NEW TEMPLATE from verified sender ---');
// Ensure API key is available
if (!process.env.BREVO_API_KEY && !process.env.BREVO_SMTP_PASS) {
    console.error('❌ Missing API Key in .env');
    process.exit(1);
}

sendWelcomeEmail(
    'kashyapkn22@gmail.com',
    'Nikhil Test New Template'
);
