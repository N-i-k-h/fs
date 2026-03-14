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

const sendProposalNotificationEmail = async ({ rfp, broker, space, message }) => {
    try {
        console.log('--- Email Debug: Partner Proposal ---');
        console.log('RFP:', rfp ? rfp.companyName : 'MISSING');
        console.log('Partner:', broker ? broker.name : 'MISSING');
        console.log('Property:', space ? space.name : 'MISSING');

        if (!rfp || !broker || !space) {
            console.warn('⚠️ Missing data for proposal email. Skipping.');
            return;
        }

        const adminEmail = process.env.ADMIN_EMAIL || 'nikhilkashyapkn@gmail.com';

        const htmlContent = `
            <div style="font-family: sans-serif; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px; max-width: 600px;">
                <h2 style="color: #0f766e; border-bottom: 2px solid #0f766e; padding-bottom: 10px;">New Partner Proposal 🏢</h2>
                
                <div style="background-color: #f9fafb; padding: 15px; border-radius: 6px; margin-top: 20px;">
                    <p><b>Partner:</b> ${broker.name}</p>
                    <p><b>Property:</b> ${space.name}</p>
                    <p><b>For RFP:</b> ${rfp.companyName || 'Corporate Lead'}</p>
                    <p><b>Seats:</b> ${rfp.seats || 'N/A'}</p>
                </div>

                <div style="margin-top: 20px; padding: 15px; background-color: #fff; border: 1px dashed #teal; border-radius: 6px;">
                    <p style="font-size: 14px; margin: 0;"><b>Partner Message:</b></p>
                    <p style="font-style: italic; color: #4b5563;">${message || 'No additional message.'}</p>
                </div>

                <p style="margin-top: 20px;">Login to the admin dashboard to review and approve this match.</p>
            </div>
        `;

        const info = await transporter.sendMail({
            from: '"SFT Partner Portal" <nikhilkashyapkn@gmail.com>',
            to: adminEmail,
            subject: `🏢 New Proposal: ${broker.name} for ${rfp.companyName || 'Lead'}`,
            html: htmlContent
        });

        console.log('✅ Proposal Notification Email sent to Admin:', info.messageId);
    } catch (err) {
        console.error('❌ Proposal Notification Email Error:', err);
    }
};

module.exports = sendProposalNotificationEmail;
