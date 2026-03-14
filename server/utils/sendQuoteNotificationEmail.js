const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.BREVO_SMTP_HOST || 'smtp-relay.brevo.com',
    port: process.env.BREVO_SMTP_PORT || 587,
    secure: false,
    auth: {
        user: process.env.BREVO_SMTP_USER,
        pass: process.env.BREVO_SMTP_PASS,
    },
});

const sendQuoteNotificationEmail = async (data) => {
    try {
        const adminEmail = process.env.ADMIN_EMAIL || 'nikhilkashyapkn@gmail.com';

        const htmlContent = `
            <div style="font-family: sans-serif; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px; max-width: 600px;">
                <h2 style="color: #0f766e; border-bottom: 2px solid #0f766e; padding-bottom: 10px;">New Quote/Brochure Request 📄</h2>
                
                <div style="background-color: #f9fafb; padding: 15px; border-radius: 6px; margin-top: 20px;">
                    <p><b>User:</b> ${data.user}</p>
                    <p><b>Email:</b> ${data.email}</p>
                    <p><b>Phone:</b> ${data.phone}</p>
                    <p><b>Interested In:</b> ${data.space || 'General'}</p>
                    <p><b>Seats:</b> ${data.seats || 'N/A'}</p>
                    <p><b>Budget:</b> ${data.budget || 'N/A'}</p>
                    <p><b>Location:</b> ${data.micromarket || 'N/A'}</p>
                </div>

                <p style="margin-top: 20px;">This user has also downloaded the brochure for ${data.space}.</p>
            </div>
        `;

        await transporter.sendMail({
            from: '"SFT Leads" <nikhilkashyapkn@gmail.com>',
            to: adminEmail,
            subject: `📄 New Quote Request: ${data.user} for ${data.space}`,
            html: htmlContent
        });

        console.log('✅ Quote Notification Email sent to Admin');
    } catch (err) {
        console.error('❌ Quote Notification Email Error:', err);
    }
};

module.exports = sendQuoteNotificationEmail;
