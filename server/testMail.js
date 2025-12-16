require('dotenv').config();
const nodemailer = require('nodemailer');

console.log('--- DEBUG CONFIG VARIANT ---');
console.log('Trying User: nikhilkashyapkn@gmail.com');
console.log('Pass Length:', process.env.BREVO_SMTP_PASS ? process.env.BREVO_SMTP_PASS.length : 0);

const transporter = nodemailer.createTransport({
    host: process.env.BREVO_SMTP_HOST,
    port: Number(process.env.BREVO_SMTP_PORT),
    secure: false, // MUST be false for port 587
    auth: {
        user: 'nikhilkashyapkn@gmail.com', // Trying explicit email
        pass: process.env.BREVO_SMTP_PASS,
    },
});

const sendWelcomeEmail = async (userEmail, userName) => {
    try {
        console.log('Attempting to verify transporter...');
        await transporter.verify();
        console.log('✅ Transporter verified');

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
        console.log('✅ Emails sent successfully via Brevo SMTP');
    } catch (error) {
        console.error('❌ Brevo SMTP Error:', error);
    }
};

sendWelcomeEmail('nikhilkashyapkn@gmail.com', 'Nikhil');
