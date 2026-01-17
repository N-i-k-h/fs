const Brevo = require('@getbrevo/brevo');
require('dotenv').config();

const apiInstance = new Brevo.TransactionalEmailsApi();
const apiKey = process.env.BREVO_API_KEY || process.env.BREVO_SMTP_PASS; // Handle both variable names just in case

apiInstance.setApiKey(
  Brevo.TransactionalEmailsApiApiKeys.apiKey,
  apiKey
);

const sendWelcomeEmail = async (userEmail, userName) => {
  try {
    console.log('Attempting to send email via Brevo API...');

    // Email to User
    await apiInstance.sendTransacEmail({
      subject: 'Welcome to FlickSpace! 🚀',
      htmlContent: `
        <div style="font-family: sans-serif; font-size: 14px; color: #333;">
          <p>Hi ${userName},</p>
          <p>Thanks for joining FlickSpace.</p>
          <p>You can now start looking for workspaces and booking them directly from our platform.</p>
          <p>Click here to explore: <a href="https://fs-5-70hj.onrender.com">https://fs-5-70hj.onrender.com</a></p>
          <br>
          <p>Best,</p>
          <p>FlickSpace Team</p>
        </div>
      `,
      sender: {
        name: 'FlickSpace',
        email: 'nikhilkashyapkn@gmail.com', // ✅ VERIFIED SENDER
      },
      to: [{ email: userEmail, name: userName }],
    });

    // Email to Admin
    await apiInstance.sendTransacEmail({
      subject: 'New User Login - FlickSpace',
      htmlContent: `
        <div style="font-family:Arial;padding:20px">
          <h3>New User Logged In</h3>
          <p><b>Name:</b> ${userName}</p>
          <p><b>Email:</b> ${userEmail}</p>
          <p><b>Time:</b> ${new Date().toLocaleString()}</p>
        </div>
      `,
      sender: {
        name: 'FlickSpace System',
        email: 'nikhilkashyapkn@gmail.com', // ✅ VERIFIED SENDER
      },
      to: [{ email: process.env.ADMIN_EMAIL }],
    });

    console.log('✅ Emails sent successfully via Brevo API');
  } catch (err) {
    console.error('❌ Brevo API Error:', err?.response?.text || err?.message || err);
  }
};

module.exports = sendWelcomeEmail;
