const axios = require('axios');

async function testAdminLoginPost() {
    const email = 'admin@flickspace.com';
    const password = 'AdminPassword123!';

    console.log(`🚀 Testing POST login for ${email}...`);
    try {
        const res = await axios.post('http://localhost:5000/api/auth/login', {
            email,
            password
        });
        console.log('✅ Login Successful!');
        console.log('Token:', res.data.token);
        console.log('User Role:', res.data.user.role);
    } catch (err) {
        console.error('❌ Login Failed:', err.response?.data?.msg || err.message);
    }
}

testAdminLoginPost();
