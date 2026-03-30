const brevo = require('./brevo');
const SibApiV3Sdk = require('sib-api-v3-sdk');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const generateRFPSubmissionPDF = (data) => {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument({ margin: 50 });
            const fileName = `RFP_Brief_${Date.now()}.pdf`;
            const tmpDir = path.join(__dirname, '..', 'tmp');
            if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir);

            const filePath = path.join(tmpDir, fileName);
            const stream = fs.createWriteStream(filePath);
            doc.pipe(stream);

            const details = data.details || {};

            // Header Section
            doc.rect(0, 0, 612, 100).fill('#0F766E');
            doc.fillColor('#FFFFFF').fontSize(24).text('OFFICE SPACE RFP BRIEF', 50, 40, { characterSpacing: 1 });
            doc.fontSize(10).text(`Generated on: ${new Date().toLocaleDateString()}`, 450, 45);
            doc.moveDown(4);

            const drawSection = (title) => {
                doc.moveDown();
                doc.fillColor('#0F766E').fontSize(14).text(title.toUpperCase(), { underline: true });
                doc.moveDown(0.5);
                doc.strokeColor('#E5E7EB').lineWidth(1).moveTo(50, doc.y).lineTo(550, doc.y).stroke();
                doc.moveDown(0.5);
            };

            const drawField = (label, value) => {
                const currentY = doc.y;
                doc.fillColor('#6B7280').fontSize(10).text(`${label}:`, 50, currentY);
                doc.fillColor('#111827').fontSize(10).text(String(value || 'Not Specified'), 180, currentY);
                doc.moveDown(0.8);
            };

            drawSection('Client Information');
            drawField('Company Name', data.companyName);
            drawField('Industry', details.industry);
            drawField('Contact Person', data.clientName || data.user);
            drawField('Email', data.email);
            drawField('Phone', data.phone);

            drawSection('Workspace Requirements');
            drawField('Primary Location', data.micromarket);
            drawField('Seats Required', `${data.seats} Pax`);
            drawField('Solution Type', Array.isArray(details.solutionType) ? details.solutionType.join(', ') : details.solutionType);
            drawField('Target Budget', data.budget);
            drawField('Move-in Timeline', data.timeline);

            doc.end();
            stream.on('finish', () => resolve(filePath));
        } catch (err) {
            reject(err);
        }
    });
};

const sendRFPSubmissionEmail = async (rfpData, brokerEmails = []) => {
    try {
        const { companyName, clientName, email, seats, timeline, micromarket, user } = rfpData;
        const adminEmail = process.env.ADMIN_EMAIL || 'nikhilkashyapkn@gmail.com';
        const senderEmail = process.env.BREVO_SENDER || adminEmail;
        
        const pdfPath = await generateRFPSubmissionPDF(rfpData);
        const pdfBase64 = fs.readFileSync(pdfPath).toString('base64');

        const clientSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
        clientSmtpEmail.subject = 'RFP Submission Received - SFT';
        clientSmtpEmail.htmlContent = `
            <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #f0f0f0; padding: 40px; border-radius: 16px; color: #333;">
                <h1 style="color: #0F766E; text-align: center;">RFP Received! 🚀</h1>
                <p>Hello <b>${clientName || user}</b>,</p>
                <p>We have successfully recorded your RFP for <b>${companyName}</b>. Our team is working on matching this with our premium workspace partners.</p>
                <div style="background: #f8fafc; padding: 25px; border-radius: 12px; margin: 30px 0; border-left: 4px solid #0F766E;">
                    <p><b>Seats:</b> ${seats} Pax | <b>Location:</b> ${micromarket} | <b>Timeline:</b> ${timeline}</p>
                </div>
            </div>
        `;
        clientSmtpEmail.sender = { "name": "SFT Corporate", "email": senderEmail };
        clientSmtpEmail.to = [{ "email": email }];
        clientSmtpEmail.attachment = [{ "content": pdfBase64, "name": "RFP_Brief.pdf" }];

        // 1. Send to Client
        await brevo.sendTransacEmail(clientSmtpEmail);

        // 2. Send to Admin
        const adminSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
        adminSmtpEmail.subject = `New Detailed RFP: ${companyName}`;
        adminSmtpEmail.htmlContent = `<p>A new high-fidelity RFP has been submitted by ${companyName}. Full brief attached.</p>`;
        adminSmtpEmail.sender = { "name": "SFT Alert", "email": senderEmail };
        adminSmtpEmail.to = [{ "email": adminEmail }];
        adminSmtpEmail.attachment = [{ "content": pdfBase64, "name": "RFP_Full_Brief.pdf" }];
        
        await brevo.sendTransacEmail(adminSmtpEmail);

        // 3. Send to Brokers
        if (brokerEmails && brokerEmails.length > 0) {
            const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
            
            // Loop for individual delivery to avoid BCC or recipient leakage
            for (const bEmail of brokerEmails) {
                const brokerSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
                brokerSmtpEmail.subject = `🎖️ [New RFP Alert] ${seats} Seats in ${micromarket}`;
                brokerSmtpEmail.htmlContent = `
                <div style="font-family: sans-serif; max-width: 600px; padding: 40px; border: 1px solid #f3f4f6; border-radius: 20px; color: #1f2937; line-height: 1.6;">
                    <h2 style="color: #0F766E; margin-bottom: 24px;">Qualified Lead Alert! 🎖️</h2>
                    <p style="font-size: 16px;">Hey there, a new high-fidelity corporate requirement has just dropped in your region.</p>
                    <div style="background: #f8fafc; padding: 25px; border-radius: 16px; margin: 24px 0;">
                        <p style="margin: 0;"><b>📍 Location:</b> ${micromarket}</p>
                        <p style="margin: 8px 0;"><b>💺 Req:</b> ${seats} Pax Office</p>
                        <p style="margin: 0;"><b>⏳ Move-In:</b> ${timeline}</p>
                    </div>
                    <p style="margin-bottom: 30px;">This lead is active and verified. Log in to your partner hub to view the technical specifications and submit your proposal.</p>
                    <a href="${frontendUrl}/broker/requests" style="display: block; text-align: center; background: #0F766E; color: white; padding: 16px 32px; border-radius: 12px; text-decoration: none; font-weight: bold; font-size: 16px; box-shadow: 0 4px 6px -1px rgba(15, 118, 110, 0.2);">View Full RFP Specs</a>
                    <p style="font-size: 12px; color: #9ca3af; margin-top: 40px; text-align: center;">SFT Corporate Partner Network | Secure Transaction Node</p>
                </div>
                `;
                brokerSmtpEmail.sender = { "name": "SFT Partner Hub", "email": senderEmail };
                brokerSmtpEmail.to = [{ "email": bEmail }];
                
                await brevo.sendTransacEmail(brokerSmtpEmail).catch(e => console.error(`❌ Broker Email Failed for ${bEmail}:`, e.message));
            }
        }

        console.log('✅ RFP Submission Emails delivered via Brevo');
    } catch (err) {
        console.error('❌ Brevo RFP Email Error:', err?.response?.text || err.message);
        throw err;
    }
};

module.exports = sendRFPSubmissionEmail;
