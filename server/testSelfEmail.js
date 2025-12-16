require('dotenv').config();
const Brevo = require('@getbrevo/brevo');

const apiInstance = new Brevo.TransactionalEmailsApi();
apiInstance.setApiKey(Brevo.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY);

const sendSelfTest = async () => {
    console.log('--- DIAGNOSTIC TEST: Sending to Verified Sender (Self) ---');
    try {
        const sendSmtpEmail = new Brevo.SendSmtpEmail();
        sendSmtpEmail.subject = "FlickSpace Diagnostic Test 🛠️";
        sendSmtpEmail.htmlContent = "<html><body><h1>System Check</h1><p>If you receive this, your API Key is valid and sending is active for verified emails.</p></body></html>";
        sendSmtpEmail.sender = { "name": "FlickSpace Diagnostics", "email": "nikhilkashyapkn@gmail.com" };
        sendSmtpEmail.to = [{ "email": "nikhilkashyapkn@gmail.com", "name": "Nikhil (Self)" }];

        const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
        console.log('✅ API accepted the request. Message ID:', data.messageId);
        console.log('👉 PLEASE CHECK: nikhilkashyapkn@gmail.com immediately.');
    } catch (error) {
        console.error('❌ API Error:', error);
    }
};

sendSelfTest();
