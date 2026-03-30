const resend = require('./resend');

const sendQuoteNotificationEmail = async (data) => {
    try {
        const adminEmail = process.env.ADMIN_EMAIL || 'nikhilkashyapkn@gmail.com';

        const htmlContent = `
            <div style="font-family: sans-serif; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px; max-width: 600px; color: #1f2937;">
                <div style="background: #0f766e; padding: 20px; border-radius: 10px 10px 0 0; color: white; text-align: center;">
                    <h2 style="margin: 0; font-size: 20px;">New Quote/Brochure Request 📄</h2>
                </div>
                <div style="padding: 20px; border: 1px solid #eee; border-top: 0; border-radius: 0 0 10px 10px;">
                    <div style="background-color: #f9fafb; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                        <p style="margin: 5px 0;"><b>👤 User:</b> ${data.user}</p>
                        <p style="margin: 5px 0;"><b>📧 Email:</b> ${data.email}</p>
                        <p style="margin: 5px 0;"><b>📞 Phone:</b> ${data.phone}</p>
                    </div>

                    <div style="border-left: 4px solid #0f766e; padding-left: 15px; margin-top: 15px;">
                        <p style="margin: 5px 0;"><b>🏢 Interested In:</b> ${data.space || 'General'}</p>
                        <p style="margin: 5px 0;"><b>👥 Seats:</b> ${data.seats || 'N/A'}</p>
                        <p style="margin: 5px 0;"><b>💰 Budget:</b> ${data.budget || 'N/A'}</p>
                        <p style="margin: 5px 0;"><b>📍 Location:</b> ${data.micromarket || 'N/A'}</p>
                    </div>

                    <p style="margin-top: 25px; font-size: 14px; color: #666; text-align: center;">This user has also downloaded the brochure for ${data.space}.</p>
                </div>
            </div>
        `;

        await resend.emails.send({
            from: 'SFT Leads <onboarding@resend.dev>',
            to: [adminEmail],
            subject: `📄 Quote Request: ${data.user} for ${data.space}`,
            html: htmlContent
        });

        console.log('✅ Quote Notification Email sent via Resend');
    } catch (err) {
        console.error('❌ Resend Quote Email Error:', err);
    }
};

module.exports = sendQuoteNotificationEmail;
