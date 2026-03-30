const brevo = require('./brevo');
const SibApiV3Sdk = require('sib-api-v3-sdk');

/**
 * Sends a payment success email to both the broker and the super-admin via Brevo.
 */
const sendPaymentSuccessEmail = async (userEmail, userName, requestId, type) => {
    try {
        const adminEmail = process.env.ADMIN_EMAIL || 'nikhilkashyapkn@gmail.com';
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        const rfpUrl = `${frontendUrl}/broker/requests`;

        const isClientType = type === 'client_details';
        const subject = isClientType ? "Client Leads Unlocked - SFT Corporate 🎖️" : "RFP Specifications Unlocked - SFT Corporate 📝";
        const title = isClientType ? "Lead Access Confirmed! 🏅" : "RFP Specifications Unlocked! 📝";
        const message = isClientType 
            ? "Transaction successful. You now have full access to the client's direct contact information and are eligible to submit your proposal." 
            : "Transaction successful. You have unlocked the technical specifications (Layout, Timeline, Budget) for this requirement.";
        const buttonText = isClientType ? "Submit Proposal Now" : "Unlock Client Contact (₹1)";

        const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
        sendSmtpEmail.subject = subject;
        sendSmtpEmail.htmlContent = `
            <div style="font-family: sans-serif; padding: 40px; background: #fafafa; border-radius: 20px; color: #333; max-width: 550px; margin: auto; border: 1px solid #eee;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <h1 style="color: #0F766E; margin: 0; font-size: 24px;">${title}</h1>
                    <p style="color: #666; font-size: 14px; margin-top: 10px;">Transaction Receipt: #${requestId.slice(-6).toUpperCase()}</p>
                </div>
                <div style="background: white; padding: 30px; border-radius: 12px; border: 1px solid #eee; text-align: center;">
                    <p style="margin-bottom: 25px; line-height: 1.6; color: #4b5563;"><b>Hello ${userName},</b><br/>${message}</p>
                    <a href="${rfpUrl}" style="display: inline-block; background: #0F766E; color: white; padding: 16px 35px; border-radius: 10px; text-decoration: none; font-weight: bold; font-size: 16px;">${buttonText}</a>
                </div>
            </div>
        `;
        sendSmtpEmail.sender = { "name": "SFT Partner Rewards", "email": adminEmail };
        sendSmtpEmail.to = [{ "email": userEmail }];

        // 1. Send to Broker
        await brevo.sendTransacEmail(sendSmtpEmail);

        // 2. Notify Admin
        const adminSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
        adminSmtpEmail.subject = `Revenue Alert: ${isClientType ? 'Client Lead' : 'RFP Spec'} Purchased - ₹1 💰`;
        adminSmtpEmail.htmlContent = `
            <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 12px;">
                <h3 style="color: #0f766e;">Lead Monetization Alert 💰</h3>
                <p>Broker <b>${userName}</b> (${userEmail}) has successfully purchased <b>${isClientType ? 'Client Contact Info' : 'RFP Specifications'}</b>.</p>
                <div style="background: #f9fafb; padding: 15px; border-radius: 8px;">
                    <p><b>RFP ID:</b> ${requestId}</p>
                    <p><b>Amount:</b> ₹1.00</p>
                    <p><b>Time:</b> ${new Date().toLocaleString('en-IN')}</p>
                </div>
            </div>
        `;
        adminSmtpEmail.sender = { "name": "SFT Revenue Bot", "email": adminEmail };
        adminSmtpEmail.to = [{ "email": adminEmail }];
        
        await brevo.sendTransacEmail(adminSmtpEmail);

        console.log(`✅ Dual success notifications delivered for ${type}`);
    } catch (err) {
        console.error('❌ Brevo Multi-Recipient Payment Email Error:', err?.response?.text || err.message);
    }
};

module.exports = sendPaymentSuccessEmail;
