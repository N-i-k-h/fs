const brevo = require('./brevo');
const SibApiV3Sdk = require('sib-api-v3-sdk');

const sendTourEmail = async (tourData) => {
    try {
        const { user, email, phone, space, date, time, seats } = tourData;
        const adminEmail = process.env.ADMIN_EMAIL || 'nikhilkashyapkn@gmail.com';
        const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
        sendSmtpEmail.subject = `New Tour Request: ${space}`;
        sendSmtpEmail.htmlContent = `
            <div style="font-family: sans-serif; padding: 20px; color: #333;">
                <h2 style="color: #0F766E;">New Tour Request 🗓️</h2>
                <div style="background: #f9fafb; padding: 20px; border-radius: 10px; border: 1px solid #eee;">
                    <p><b>User:</b> ${user} (${email})</p>
                    <p><b>Space:</b> ${space}</p>
                    <p><b>Date/Time:</b> ${date} at ${time}</p>
                    <p><b>Capacity:</b> ${seats} Pax</p>
                </div>
            </div>
        `;
        sendSmtpEmail.sender = { "name": "SFT Tours", "email": adminEmail };
        sendSmtpEmail.to = [{ "email": adminEmail }, { "email": email }];

        await brevo.sendTransacEmail(sendSmtpEmail);
        console.log(`✅ Tour request email sent to admin and ${email} via Brevo`);
    } catch (err) {
        console.error('❌ Brevo Tour Email Error:', err?.response?.text || err.message);
        throw err;
    }
};

module.exports = sendTourEmail;
