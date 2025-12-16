const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.BREVO_SMTP_HOST,
    port: Number(process.env.BREVO_SMTP_PORT),
    secure: false, // MUST be false for port 587
    auth: {
        user: process.env.BREVO_SMTP_USER, // MUST be "apikey"
        pass: process.env.BREVO_SMTP_PASS, // Your Brevo API key
    },
});

const sendWelcomeEmail = async (userEmail, userName) => {
    try {
        // 1️⃣ Send Welcome Email to User
        await transporter.sendMail({
            from: '"FlickSpace" <nikhilkashyapkn@gmail.com>',
            to: userEmail,
            subject: 'Welcome to FlickSpace 🎉',
            html: `
        <div style="font-family: Arial;">
          <h2>Welcome ${userName} 👋</h2>
          <p>Your FlickSpace account is ready.</p>
          <p>Start exploring workspaces now.</p>
          <br/>
          <p>— FlickSpace Team</p>
        </div>
      `,
        });

        // 2️⃣ Notify Admin
        await transporter.sendMail({
            from: '"FlickSpace System" <nikhilkashyapkn@gmail.com>',
            to: process.env.ADMIN_EMAIL,
            subject: 'New User Login - FlickSpace',
            html: `
        <p><strong>Name:</strong> ${userName}</p>
        <p><strong>Email:</strong> ${userEmail}</p>
        <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
      `,
        });

        console.log('✅ Emails sent successfully via Brevo SMTP');

    } catch (error) {
        console.error('❌ Brevo SMTP Error:', error);
    }
};

module.exports = sendWelcomeEmail;
