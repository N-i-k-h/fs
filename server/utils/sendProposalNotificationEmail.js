const resend = require('./resend');

const sendProposalNotificationEmail = async ({ rfp, broker, space, message }) => {
    try {
        if (!rfp || !broker || !space) {
            console.warn('⚠️ Missing data for proposal email. Skipping.');
            return;
        }

        const adminEmail = process.env.ADMIN_EMAIL || 'nikhilkashyapkn@gmail.com';
        const recipients = [adminEmail];
        if (rfp.email) recipients.push(rfp.email);

        const htmlContent = `
            <div style="font-family: sans-serif; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px; max-width: 600px; color: #1f2937;">
                <div style="background: #0f766e; padding: 20px; border-radius: 10px 10px 0 0; color: white;">
                    <h2 style="margin: 0; font-size: 20px;">New Office Proposal 🏢</h2>
                </div>
                
                <div style="padding: 20px; border: 1px solid #eee; border-top: 0; border-radius: 0 0 10px 10px;">
                    <p style="margin-top: 0; font-weight: bold; color: #0f766e;">Hello ${rfp.clientName || 'Client'},</p>
                    <p>A Partner has submitted a new proposal for your requirement: <b>${rfp.companyName || 'Corporate RFP'}</b>.</p>

                    <div style="background-color: #f9fafb; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                        <p style="margin: 5px 0;"><b>🤝 Partner:</b> ${broker.name}</p>
                        <p style="margin: 5px 0;"><b>🏢 Property:</b> ${space.name}</p>
                        <p style="margin: 5px 0;"><b>📁 Requirement:</b> ${rfp.companyName || 'Lead'}</p>
                        <p style="margin: 5px 0;"><b>👥 Budget:</b> ${rfp.budget || 'As per RFP'}</p>
                    </div>

                    <div style="margin-top: 20px; padding: 15px; background-color: #fff; border: 1px dashed #0f766e; border-radius: 8px;">
                        <p style="font-size: 14px; margin: 0; color: #0f766e; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">Partner Pitch:</p>
                        <p style="font-style: italic; color: #4b5563; margin-top: 10px;">${message || 'No additional message.'}</p>
                    </div>

                    <div style="text-align: center; margin-top: 30px;">
                        <p style="font-size: 14px; color: #666;">View full details and initiate a handshake in your dashboard.</p>
                        <a href="https://flickspace.in/dashboard" style="display: inline-block; background: #0f766e; color: white; padding: 15px 30px; border-radius: 12px; text-decoration: none; font-weight: bold; margin-top: 10px;">View Proposal & Handshake</a>
                    </div>
                </div>
            </div>
        `;

        await resend.emails.send({
            from: 'SFT Partners <onboarding@resend.dev>',
            to: recipients,
            subject: `🏢 Proposal Received: ${broker.name} for your RFP`,
            html: htmlContent
        });

        console.log('✅ Proposal Notification Email sent via Resend');
    } catch (err) {
        console.error('❌ Resend Proposal Email Error:', err);
    }
};

module.exports = sendProposalNotificationEmail;
