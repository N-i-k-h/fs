const resend = require('./resend');

const sendProposalNotificationEmail = async ({ rfp, broker, space, message }) => {
    try {
        if (!rfp || !broker || !space) {
            console.warn('⚠️ Missing data for proposal email. Skipping.');
            return;
        }

        const adminEmail = process.env.ADMIN_EMAIL || 'nikhilkashyapkn@gmail.com';

        const htmlContent = `
            <div style="font-family: sans-serif; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px; max-width: 600px; color: #1f2937;">
                <div style="background: #0f766e; padding: 20px; border-radius: 10px 10px 0 0; color: white;">
                    <h2 style="margin: 0; font-size: 20px;">New Partner Proposal 🏢</h2>
                </div>
                
                <div style="padding: 20px; border: 1px solid #eee; border-top: 0; border-radius: 0 0 10px 10px;">
                    <div style="background-color: #f9fafb; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                        <p style="margin: 5px 0;"><b>🤝 Partner:</b> ${broker.name}</p>
                        <p style="margin: 5px 0;"><b>🏢 Property:</b> ${space.name}</p>
                        <p style="margin: 5px 0;"><b>📁 For RFP:</b> ${rfp.companyName || 'Corporate Lead'}</p>
                        <p style="margin: 5px 0;"><b>👥 Seats:</b> ${rfp.seats || 'N/A'}</p>
                    </div>

                    <div style="margin-top: 20px; padding: 15px; background-color: #fff; border: 1px dashed #0f766e; border-radius: 8px;">
                        <p style="font-size: 14px; margin: 0; color: #0f766e; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">Partner Message:</p>
                        <p style="font-style: italic; color: #4b5563; margin-top: 10px;">${message || 'No additional message.'}</p>
                    </div>

                    <div style="text-align: center; margin-top: 30px;">
                        <p style="font-size: 14px; color: #666;">Review and approve this match in the admin portal.</p>
                        <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/admin/rfps" style="display: inline-block; background: #0f766e; color: white; padding: 12px 25px; border-radius: 8px; text-decoration: none; font-weight: bold; margin-top: 10px;">Manage Proposals</a>
                    </div>
                </div>
            </div>
        `;

        await resend.emails.send({
            from: 'SFT Partners <onboarding@resend.dev>',
            to: [adminEmail],
            subject: `🏢 New Proposal: ${broker.name} for ${rfp.companyName || 'Lead'}`,
            html: htmlContent
        });

        console.log('✅ Proposal Notification Email sent via Resend');
    } catch (err) {
        console.error('❌ Resend Proposal Email Error:', err);
    }
};

module.exports = sendProposalNotificationEmail;
