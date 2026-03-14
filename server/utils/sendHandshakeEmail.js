const nodemailer = require('nodemailer');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const transporter = nodemailer.createTransport({
    host: process.env.BREVO_SMTP_HOST || 'smtp-relay.brevo.com',
    port: process.env.BREVO_SMTP_PORT || 587,
    secure: false,
    auth: {
        user: process.env.BREVO_SMTP_USER,
        pass: process.env.BREVO_SMTP_PASS,
    },
});

const generateHandshakePDF = (data) => {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument({ margin: 50 });
            const fileName = `Handshake_${Date.now()}.pdf`;
            const tmpDir = path.join(__dirname, '..', 'tmp');

            if (!fs.existsSync(tmpDir)) {
                fs.mkdirSync(tmpDir);
            }

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
        const pdfPath = await generateHandshakePDF(data);

        const htmlContent = `
            <div style="font-family: sans-serif; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px; max-width: 600px;">
                <h2 style="color: #0f766e; border-bottom: 2px solid #0f766e; padding-bottom: 10px;">New Handshake Initiated 🤝</h2>
                <div style="background-color: #f9fafb; padding: 15px; border-radius: 6px; margin-top: 20px;">
                    <p><b>Customer:</b> ${data.user}</p>
                    <p><b>Email:</b> ${data.email}</p>
                    <p><b>Space:</b> ${data.space}</p>
                    <p><b>Seats:</b> ${data.seats}</p>
                </div>
                <p style="margin-top: 15px;">A PDF with complete details is attached.</p>
            </div>
        `;

        await transporter.sendMail({
            from: '"SFT Handshake" <nikhilkashyapkn@gmail.com>',
            to: adminEmail,
            subject: `🤝 New Handshake: ${data.user} x ${data.space}`,
            html: htmlContent,
            attachments: [{
                filename: path.basename(pdfPath),
                path: pdfPath
            }]
        });

        console.log('✅ Handshake Admin Email sent');
        // fs.unlinkSync(pdfPath); // Optionally delete
    } catch (err) {
        console.error('❌ Handshake Email Error:', err);
    }
};

module.exports = sendHandshakeEmail;
