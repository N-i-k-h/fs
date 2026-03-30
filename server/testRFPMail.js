const sendRFPSubmissionEmail = require('./utils/sendRFPSubmissionEmail');
require('dotenv').config();

const testData = {
    companyName: 'Test Corp',
    clientName: 'Nikhil Kashyap',
    email: 'nikhilkashyapkn@gmail.com',
    user: 'Nikhil',
    seats: 50,
    timeline: 'Immediate',
    micromarket: 'Koramangala',
    budget: '15,000 / Seat',
    phone: '9876543210',
    details: {
        industry: 'Tech',
        expansionSeats: 10,
        solutionType: ['Managed Office'],
        leasePeriod: '3 Years',
        detailedRequirement: 'Need a premium office with great view.'
    }
};

(async () => {
    console.log('🚀 Sending Test RFP Email with PDF via Resend...');
    await sendRFPSubmissionEmail(testData);
    console.log('✅ If no error above, check your inbox!');
})();
