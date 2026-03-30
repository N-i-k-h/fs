const SibApiV3Sdk = require('sib-api-v3-sdk');
require('dotenv').config();

const defaultClient = SibApiV3Sdk.ApiClient.instance;

// Configure API key authorization: api-key
const apiKey = defaultClient.authentications['api-key'];

// Prioritize ENV, then fallback to verified service key
const BREVO_KEY = process.env.BREVO_API_KEY || process.env.SIB_API_KEY;

if (BREVO_KEY) {
    apiKey.apiKey = BREVO_KEY;
    console.log('📬 Brevo API Key Initialized (Masked):', BREVO_KEY.substring(0, 8) + '...');
}

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
module.exports = apiInstance;
