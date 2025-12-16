const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    host: process.env.BREVO_SMTP_HOST,
    port: process.env.BREVO_SMTP_PORT, // 587
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.BREVO_SMTP_USER, // 'apikey'
        pass: process.env.BREVO_SMTP_PASS, // Your Brevo key
    },
});

const sendWelcomeEmail = async (userEmail, userName) => {
    try {
        // User email
        const userMailOptions = {
            from: '"FlickSpace" <nikhilkashyapkn@gmail.com>',
            to: userEmail,
            subject: 'Welcome to FlickSpace 🎉',
            html: `
        <h2>Welcome, ${userName}!</h2>
        <p>Thanks for joining FlickSpace.</p>
        <p>Explore premium workspaces with ease 🚀</p>
      `,
        };

        // Admin email
        const adminMailOptions = {
            from: '"FlickSpace Admin" <nikhilkashyapkn@gmail.com>',
            to: process.env.ADMIN_EMAIL,
            subject: 'New User Login',
            html: `
        <p><b>Name:</b> ${userName}</p>
        <p><b>Email:</b> ${userEmail}</p>
        <p><b>Time:</b> ${new Date().toLocaleString()}</p>
      `,
        };

        await transporter.sendMail(userMailOptions);
        await transporter.sendMail(adminMailOptions);

        console.log('✅ Emails sent successfully via Brevo SMTP');
    } catch (err) {
        console.error('❌ Email error:', err);
    }
};

module.exports = sendWelcomeEmail;
