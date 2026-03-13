const axios = require('axios');

async function testBrokerLogin() {
    const email = 'broker@test.com';
    const password = 'BrokerPassword123!';

    console.log(`🚀 Testing Broker Login for ${email}...`);
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

testBrokerLogin();
