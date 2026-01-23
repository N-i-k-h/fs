const axios = require('axios');

const testQuote = async () => {
    try {
        const payload = {
            fullName: "Test User",
            email: "test@example.com",
            phone: "1234567890",
            seats: "5",
            budget: "5000",
            timeline: "Immediate",
            micromarket: "Downtown",
            spaceName: "Test Space",
            spaceId: "1"
        };

        console.log("Sending payload:", payload);

        const res = await axios.post('http://localhost:5000/api/requests/quote', payload);
        console.log('✅ Response:', res.data);
    } catch (err) {
        console.error('❌ Error:', err.response ? err.response.data : err.message);
    }
};

testQuote();
