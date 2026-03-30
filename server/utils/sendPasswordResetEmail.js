const brevo = require('./brevo');
const SibApiV3Sdk = require('sib-api-v3-sdk');

/**
 * Sends a password reset email to the user via Brevo.
 */
const sendPasswordResetEmail = async (userEmail, resetUrl) => {
    try {
        const adminEmail = process.env.ADMIN_EMAIL || 'nikhilkashyapkn@gmail.com';
        const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
        sendSmtpEmail.subject = 'Password Reset Request - SFT Security 🔐';
        sendSmtpEmail.htmlContent = `
            <div style="font-family: sans-serif; padding: 40px; background: #fafafa; border-radius: 20px; color: #333; max-width: 500px; margin: auto; border: 1px solid #eee;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <h1 style="color: #0c0a09; margin: 0; font-size: 24px;">Reset Your Password</h1>
                    <p style="color: #666; font-size: 14px; margin-top: 10px;">Security Verification Request</p>
                </div>

                <div style="background: white; padding: 30px; border-radius: 12px; border: 1px solid #eee; text-align: center;">
                    <p style="margin-bottom: 25px; line-height: 1.6;">You've requested to reset your password. Click the button below to choose a new one. This link expires in 1 hour.</p>
                    
                    <a href="${resetUrl}" style="display: inline-block; background: #0F766E; color: white; padding: 16px 35px; border-radius: 10px; text-decoration: none; font-weight: bold; font-size: 16px; box-shadow: 0 4px 12px rgba(15,118,110,0.2);">Reset Password Now</a>
                </div>

                <div style="margin-top: 30px; text-align: center; font-size: 11px; color: #999;">
                    <p>If you didn't request this, you can safely ignore this email.</p>
                    <p>Sent via SFT Security Protocol • Protected Access</p>
                </div>
            </div>
        `;
        sendSmtpEmail.sender = { "name": "SFT Security", "email": adminEmail };
        sendSmtpEmail.to = [{ "email": userEmail }];

        await brevo.sendTransacEmail(sendSmtpEmail);
        console.log(`✅ Password reset email delivered to ${userEmail} via Brevo`);
    } catch (err) {
        console.error('❌ Brevo Reset Email Error:', err?.response?.text || err.message);
        throw err;
    }
};

module.exports = sendPasswordResetEmail;
