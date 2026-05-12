const axios = require('axios');

async function test() {
    try {
        const res = await axios.post('http://127.0.0.1:5000/api/auth/register', {
            name: 'test partner',
            email: 'testpartner' + Date.now() + '@example.com',
            password: 'password123',
            role: 'broker'
        });
        console.log('Success:', res.data);
    } catch (err) {
        console.error('Error Code:', err.code);
        console.error('Error Response:', err.response ? err.response.data : 'No response');
    }
}

test();
