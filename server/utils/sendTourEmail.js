const Brevo = require('@getbrevo/brevo');
require('dotenv').config();

const apiInstance = new Brevo.TransactionalEmailsApi();
const apiKey = process.env.BREVO_API_KEY;

apiInstance.setApiKey(
    Brevo.TransactionalEmailsApiApiKeys.apiKey,
    apiKey
);

const sendTourEmail = async (tourData) => {
    try {
        console.log('Attempting to send Tour Request Email via Brevo API...');

        const { user, email, phone, space, date, time, seats } = tourData;
        const adminEmail = process.env.ADMIN_EMAIL || 'nikhilkashyapkn@gmail.com';

        // Email to Admin
        await apiInstance.sendTransacEmail({
            subject: `New Tour Request: ${space} 📅`,
            htmlContent: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px; max-width: 600px;">
          <h2 style="color: #0f766e; border-bottom: 2px solid #0f766e; padding-bottom: 10px;">New Tour Scheduled 🗓️</h2>
          
          <div style="background-color: #f9fafb; padding: 15px; border-radius: 6px; margin-top: 20px;">
            <p style="margin: 5px 0;"><b>👤 Name:</b> ${user}</p>
            <p style="margin: 5px 0;"><b>📧 Email:</b> ${email}</p>
            <p style="margin: 5px 0;"><b>📞 Phone:</b> ${phone}</p>
          </div>

          <div style="margin-top: 20px;">
            <h3 style="color: #374151;">Workspace Details</h3>
            <p style="font-size: 16px;">🏢 <b>${space}</b></p>
            <p>📅 <b>Date:</b> ${date}</p>
            <p>⏰ <b>Time:</b> ${time}</p>
            <p>👥 <b>Seats:</b> ${seats}</p>
          </div>

          <div style="margin-top: 30px; font-size: 12px; color: #6b7280; border-top: 1px solid #e5e7eb; padding-top: 10px;">
            <p>Sent via FlickSpace System</p>
          </div>
        </div>
      `,
            sender: {
                name: 'FlickSpace System',
                email: process.env.ADMIN_EMAIL || 'nikhilkashyapkn@gmail.com', // Verified Sender
            },
            to: [{ email: adminEmail }],
        });

        console.log('✅ Tour Request Email sent successfully to Admin');
    } catch (err) {
        console.error('❌ Brevo API Tour Email Error:', err?.response?.text || err?.message || err);
    }
};

module.exports = sendTourEmail;
