const resend = require('./resend');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const generateHandshakePDF = (data) => {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument({ margin: 50 });
            const fileName = `Handshake_${Date.now()}.pdf`;
            const tmpDir = path.join(__dirname, '..', 'tmp');

            if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir);

            const filePath = path.join(tmpDir, fileName);
            const stream = fs.createWriteStream(filePath);
            doc.pipe(stream);

            // Header
            doc.fillColor('#0F766E').fontSize(24).text('SFT - Handshake Request', { align: 'center' });
            doc.moveDown();
            doc.strokeColor('#E5E7EB').lineWidth(1).moveTo(50, doc.y).lineTo(550, doc.y).stroke();
            doc.moveDown();

            // Details
            doc.fillColor('#111827').fontSize(16).text('Customer Details', { underline: true });
            doc.moveDown(0.5);
            doc.fontSize(12).fillColor('#374151');
            doc.text(`Name: ${data.user}`);
            doc.text(`Email: ${data.email}`);
            doc.text(`Phone: ${data.phone}`);
            doc.text(`Seats Required: ${data.seats}`);
            doc.text(`Budget: ${data.budget}`);
            doc.text(`Timeline: ${data.timeline}`);

            doc.moveDown();
            doc.fillColor('#111827').fontSize(16).text('Workspace Interest', { underline: true });
            doc.moveDown(0.5);
            doc.fontSize(12).fillColor('#374151');
            doc.text(`Space Name: ${data.space}`);

            doc.moveDown(2);
            doc.fontSize(10).fillColor('#9CA3AF').text('This is an automated handshake notification from SFT.', { align: 'center', italic: true });

            doc.end();
            stream.on('finish', () => resolve(filePath));
        } catch (err) {
            reject(err);
        }
    });
};

const sendHandshakeEmail = async (data) => {
    try {
        const adminEmail = process.env.ADMIN_EMAIL || 'nikhilkashyapkn@gmail.com';
        const recipient = data.to || adminEmail;
        const pdfPath = await generateHandshakePDF(data);
        const pdfContent = fs.readFileSync(pdfPath);

        const htmlContent = `
            <div style="font-family: sans-serif; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px; max-width: 600px; color: #1f2937;">
                <div style="background: #0f766e; padding: 20px; border-radius: 8px 8px 0 0; color: white;">
                    <h2 style="margin: 0; font-size: 20px;">New Handshake Initiated 🤝</h2>
                </div>
                <div style="padding: 20px; border: 1px solid #eee; border-top: 0; border-radius: 0 0 8px 8px;">
                    <div style="background-color: #f9fafb; padding: 15px; border-radius: 6px; margin-top: 20px;">
                        <p style="margin: 5px 0;"><b>👤 Customer:</b> ${data.user}</p>
                        <p style="margin: 5px 0;"><b>📧 Email:</b> ${data.email}</p>
                        <p style="margin: 5px 0;"><b>🏢 Space:</b> ${data.space}</p>
                        <p style="margin: 5px 0;"><b>👥 Seats:</b> ${data.seats}</p>
                    </div>
                    ${data.to ? `<p style="margin-top: 20px; font-weight: bold; color: #0f766e;">Congratulations! The client has accepted your proposal. Please log in to your dashboard to unlock their full contact details.</p>` : `<p style="margin-top: 20px; font-size: 14px;">A formal handshake document has been generated as a PDF and is attached herewith.</p>`}
                </div>
            </div>
        `;

        await resend.emails.send({
            from: 'SFT Handshake <onboarding@resend.dev>',
            to: [recipient],
            subject: data.to ? `🤝 Handshake Won: ${data.user} x ${data.space}` : `🤝 Handshake Alert: ${data.user} x ${data.space}`,
            html: htmlContent,
            attachments: [{ filename: path.basename(pdfPath), content: pdfContent }]
        });

        console.log(`✅ Handshake Email sent to ${recipient} via Resend`);
    } catch (err) {
        console.error('❌ Resend Handshake Error:', err);
    }
};

module.exports = sendHandshakeEmail;
