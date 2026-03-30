require('dotenv').config();
const nodemailer = require('nodemailer');

const test = async (user, pass) => {
    console.log(`Testing SMTP with user: ${user}`);
    const transporter = nodemailer.createTransport({
        host: 'smtp-relay.brevo.com',
        port: 587,
        secure: false,
        auth: { user, pass },
    });
    try {
        await transporter.verify();
        console.log(`✅ Success with user: ${user}`);
        return true;
    } catch (e) {
        console.log(`❌ Failed with user: ${user}. Error: ${e.message}`);
        return false;
    }
};

const run = async () => {
    const pass = process.env.BREVO_SMTP_PASS;
    const email = process.env.ADMIN_EMAIL;

    await test('apikey', pass);
    await test(email, pass);
};

run();
