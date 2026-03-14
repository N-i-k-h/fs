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

const generateRFPPDF = (rfp, space, broker) => {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument({ margin: 50 });
            const fileName = `RFP_Approved_${rfp._id.toString().slice(-6)}.pdf`;
            const filePath = path.join(__dirname, '..', 'tmp', fileName);

            // Ensure tmp dir exists
            if (!fs.existsSync(path.join(__dirname, '..', 'tmp'))) {
                fs.mkdirSync(path.join(__dirname, '..', 'tmp'));
            }

            const stream = fs.createWriteStream(filePath);
            doc.pipe(stream);

            // Header - Branding
            doc.fillColor('#0F766E') // SFT Teal
                .fontSize(24)
                .text('SFT - Approved RFP Brief', { align: 'center' });

            doc.moveDown();
            doc.fillColor('#4B5563')
                .fontSize(10)
                .text(`Reference ID: ${rfp._id}`, { align: 'right' })
                .text(`Approval Date: ${new Date().toLocaleDateString()}`, { align: 'right' });

            doc.moveDown();
            doc.strokeColor('#E5E7EB').lineWidth(1).moveTo(50, doc.y).lineTo(550, doc.y).stroke();
            doc.moveDown();

            // Client Section
            doc.fillColor('#111827').fontSize(16).text('Client Requirements', { underline: true });
            doc.moveDown(0.5);
            doc.fontSize(12).fillColor('#374151');
            doc.text(`Company: ${rfp.companyName || 'N/A'}`);
            doc.text(`Client Name: ${rfp.clientName || rfp.user || 'N/A'}`);
            doc.text(`Seats Required: ${rfp.seats || 'N/A'}`);
            doc.text(`Timeline: ${rfp.timeline || 'N/A'}`);
            doc.text(`Budget: ${rfp.budget || 'N/A'}`);
            doc.text(`Preferred Location: ${rfp.micromarket || 'N/A'}`);

            doc.moveDown();

            // Space Section
            doc.fillColor('#111827').fontSize(16).text('Approved Property Details', { underline: true });
            doc.moveDown(0.5);
            doc.fontSize(12).fillColor('#374151');
            doc.text(`Office Name: ${space.name}`);
            doc.text(`Location: ${space.location}, ${space.city}`);
            doc.text(`Rent: ₹${space.price.toLocaleString()} per seat`);

            doc.moveDown();

            // Broker Section
            doc.fillColor('#111827').fontSize(16).text('Designated Partner', { underline: true });
            doc.moveDown(0.5);
            doc.fontSize(12).fillColor('#374151');
            doc.text(`Partner Name: ${broker.name}`);
            doc.text(`Email: ${broker.email}`);
            doc.text(`Phone: ${broker.phone || 'N/A'}`);

            doc.moveDown(2);
            doc.fontSize(10).fillColor('#9CA3AF').text('This is a system-generated document from SFT Corporate Portal.', { align: 'center', italic: true });

            doc.end();

            stream.on('finish', () => resolve(filePath));
            stream.on('error', reject);
        } catch (err) {
            reject(err);
        }
    });
};

const sendRFPApprovalEmail = async ({ rfp, space, broker }) => {
    try {
        const pdfPath = await generateRFPPDF(rfp, space, broker);

        const htmlContent = `
            <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
                <h2 style="color: #0F766E;">RFP Approved! 🤝</h2>
                <p>Hello,</p>
                <p>We are pleased to inform you that the RFP for <strong>${rfp.companyName || 'Corporate Requirement'}</strong> has been approved and matched with a premium workspace.</p>
                
                <div style="background: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0;">
                    <h3 style="margin-top: 0; color: #111827;">Workspace Details:</h3>
                    <p><strong>Property:</strong> ${space.name}</p>
                    <p><strong>Location:</strong> ${space.location}, ${space.city}</p>
                    <p><strong>Partner:</strong> ${broker.name} (${broker.email})</p>
                </div>

                <p>Please find the detailed RFP attachment for your reference.</p>
                <p>Our team will contact you shortly to finalize the site visit and commercials.</p>
                
                <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                <p style="font-size: 12px; color: #6b7280;">Best Regards,<br><strong>SFT Corporate Team</strong></p>
            </div>
        `;

        const adminEmail = process.env.ADMIN_EMAIL || 'nikhilkashyapkn@gmail.com';
        const mailOptions = {
            from: '"SFT Corporate" <nikhilkashyapkn@gmail.com>',
            to: [rfp.email, broker.email, adminEmail],
            subject: `RFP Approved: ${rfp.companyName || 'Requirement'} x ${space.name}`,
            html: htmlContent,
            attachments: [
                {
                    filename: path.basename(pdfPath),
                    path: pdfPath
                }
            ]
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('✅ RFP Approval Email sent:', info.messageId);

        // Optional: Clean up PDF after sending
        // fs.unlinkSync(pdfPath);

    } catch (err) {
        console.error('❌ RFP Approval Email Error:', err);
    }
};

module.exports = sendRFPApprovalEmail;
