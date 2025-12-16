require('dotenv').config();
const sendWelcomeEmail = require('./utils/sendWelcomeEmail');

console.log('--- TEST: Sending from verified sender ---');
sendWelcomeEmail(
    'nikhilkashyapkn@gmail.com', // Sending to self/admin for test
    'Nikhil Test'
);
