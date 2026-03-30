const SibApiV3Sdk = require('sib-api-v3-sdk');
require('dotenv').config();

const testBrevo = async () => {
    try {
        console.log('🚀 Sending test email via Brevo...');
        const adminEmail = process.env.ADMIN_EMAIL || 'nikhilkashyapkn@gmail.com';
        
        const defaultClient = SibApiV3Sdk.ApiClient.instance;
        const apiKey = defaultClient.authentications['api-key'];
        apiKey.apiKey = process.env.BREVO_API_KEY;

        const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
        
        const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
        sendSmtpEmail.subject = "SFT Brevo Integration Test 🚀";
        sendSmtpEmail.htmlContent = `
            <div style="font-family: sans-serif; padding: 20px;">
                <h2>Brevo Integration Successful! 🎉</h2>
                <p>This is a test email from the Flickspace platform using the new Brevo API key.</p>
                <p><b>Configuration:</b></p>
                <ul><li><b>Admin:</b> ${adminEmail}</li></ul>
            </div>
        `;
        sendSmtpEmail.sender = { "name": "SFT Test", "email": adminEmail };
        sendSmtpEmail.to = [{ "email": "nikhilkashyapkn@gmail.com" }];

        const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
        console.log('✅ Success! Message ID:', data.messageId);
    } catch (err) {
        console.error('❌ Brevo Error:', err.response?.text || err.message);
    }
};

testBrevo();
