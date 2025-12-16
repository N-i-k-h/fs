const axios = require('axios');

const testBooking = async () => {
    try {
        const payload = {
            user: "Test User",
            email: "test@example.com",
            phone: "1234567890",
            space: "Test Workspace Name", // Replicating old behavior (but schema now supports 'space')
            spaceName: "Test Workspace Name", // Replicating new behavior
            date: "2025-01-01",
            time: "10:00",
            seats: 2
        };

        console.log('🚀 Sending Test Request...');
        const res = await axios.post('http://localhost:5000/api/requests/tour', payload);
        console.log('✅ Response:', res.data);

    } catch (err) {
        console.error('❌ Error:', err.response ? err.response.data : err.message);
    }
};

testBooking();
