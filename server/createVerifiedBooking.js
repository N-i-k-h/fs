const axios = require('axios');

const createRealLookingBooking = async () => {
    try {
        const payload = {
            user: "Admin Test",
            email: "admin.test@flickspace.com",
            phone: "9876543210",
            space: "WeWork Galaxy",
            spaceName: "WeWork Galaxy",
            date: "2024-03-20",
            time: "11:00",
            seats: 4
        };

        console.log('🚀 Creating Verified Booking...');
        await axios.post('http://localhost:5000/api/requests/tour', payload);
        console.log('✅ Booking Created. Check Admin Panel.');

    } catch (err) {
        console.error('❌ Error:', err.message);
    }
};

createRealLookingBooking();
