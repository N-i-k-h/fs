const brevo = require('./brevo');
const SibApiV3Sdk = require('sib-api-v3-sdk');

/**
 * Sends a welcome email to the user via Brevo.
 */
const sendWelcomeEmail = async (userEmail, userName) => {
    try {
        const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
        sendSmtpEmail.subject = 'Welcome to SFT 🎉';
        sendSmtpEmail.htmlContent = `
            <div style="font-family: sans-serif; padding: 20px; color: #333;">
                <h2 style="color: #0c0a09;">Welcome, ${userName}!</h2>
                <p>Thanks for joining SFT.</p>
                <p>Explore premium workspaces with ease 🚀</p>
                <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
                <p style="font-size: 12px; color: #666;">You're receiving this because you signed up on SFT.</p>
            </div>
        `;
        sendSmtpEmail.sender = { "name": "SFT Connect", "email": process.env.ADMIN_EMAIL || 'nikhilkashyapkn@gmail.com' };
        sendSmtpEmail.to = [{ "email": userEmail }];

        await brevo.sendTransacEmail(sendSmtpEmail);
        console.log(`✅ Welcome email sent to ${userEmail} via Brevo`);
    } catch (err) {
        console.error('❌ Brevo Welcome Email Error:', err?.response?.text || err.message);
        throw err;
    }
};

/**
 * Notifies the Super Admin of user activity via Brevo.
 */
const notifyAdminOfActivity = async (userEmail, userName, activityType = 'Login') => {
    try {
        const adminEmail = process.env.ADMIN_EMAIL || 'nikhilkashyapkn@gmail.com';
        const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
        sendSmtpEmail.subject = `User Activity: ${activityType} - ${userName}`;
        sendSmtpEmail.htmlContent = `
            <div style="font-family: sans-serif; padding: 20px; background: #fafafa; border-radius: 10px; border: 1px solid #eee;">
                <h3 style="color: #0f766e; margin-top: 0;">User Activity Notification 🚨</h3>
                <p>A user performed a <b>${activityType}</b> on the platform.</p>
                <div style="background: white; padding: 15px; border-radius: 8px; border: 1px solid #eee; margin-top: 15px;">
                    <p style="margin: 5px 0;"><b>Name:</b> ${userName}</p>
                    <p style="margin: 5px 0;"><b>Email:</b> ${userEmail}</p>
                    <p style="margin: 5px 0;"><b>Activity:</b> ${activityType}</p>
                    <p style="margin: 5px 0;"><b>Time (IST):</b> ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
                </div>
            </div>
        `;
        sendSmtpEmail.sender = { "name": "SFT Security", "email": adminEmail };
        sendSmtpEmail.to = [{ "email": adminEmail }];

        await brevo.sendTransacEmail(sendSmtpEmail);
        console.log(`📡 Admin notified of ${activityType} for ${userEmail} via Brevo`);
    } catch (err) {
        console.error('❌ Brevo Admin Notification Error:', err?.response?.text || err.message);
    }
};

module.exports = { sendWelcomeEmail, notifyAdminOfActivity };
