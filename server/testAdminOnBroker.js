const axios = require('axios');

async function testAdminLoginOnBroker() {
    const email = 'admin@flickspace.com';
    const password = 'AdminPassword123!';

    console.log(`🚀 Testing Admin Login on Broker Portal for ${email}...`);
    try {
        const res = await axios.post('http://localhost:5000/api/auth/broker-login', {
            email,
            password
        });
        console.log('✅ Login Successful!');
        console.log('Token:', res.data.token.substring(0, 10) + '...');
        console.log('User Role:', res.data.user.role);
    } catch (err) {
        console.log('❌ Login Failed!');
        console.log('Status:', err.response?.status);
        console.log('Message:', err.response?.data?.msg || err.message);
    }
}

testAdminLoginOnBroker();
