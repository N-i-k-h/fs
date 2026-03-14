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

            // 1. Client Profile
            drawSection('Client Information');
            drawField('Company Name', data.companyName);
            drawField('Industry', details.industry);
            drawField('Contact Person', data.clientName || data.user);
            drawField('Email', data.email);
            drawField('Phone', data.phone);
            drawField('Funding Status', details.fundingStatus);

            // 2. Requirement Dynamics
            drawSection('Workspace Requirements');
            drawField('Primary Location', data.micromarket);
            drawField('Seats Required', `${data.seats} Pax`);
            drawField('Expansion Plan', `${details.expansionSeats || 0} Seats`);
            drawField('Solution Type', Array.isArray(details.solutionType) ? details.solutionType.join(', ') : details.solutionType);
            drawField('Lease Period', details.leasePeriod);
            drawField('Lock-in Period', details.lockInPeriod);
            drawField('Working Hours', details.workingHours);

            // 3. Technical Specs & Layout
            drawSection('Infrastructure & Layout');
            drawField('Manager Cabins', details.managerCabins);
            drawField('Pantry Type', details.pantryType);
            drawField('Server Room', details.serverRoomRequired ? 'Required' : 'Not Required');
            if (details.meetingRooms) {
                const rooms = Object.entries(details.meetingRooms)
                    .filter(([_, v]) => Number(v) > 0)
                    .map(([k, v]) => `${k.replace('pax', '')}Pax:${v}`).join(', ');
                drawField('Meeting Rooms', rooms || 'None');
            }
            drawField('Amenities', Array.isArray(details.amenities) ? details.amenities.join(', ') : 'Standard');

            // 4. Commercials & Timeline
            drawSection('Commercials & Timeline');
            drawField('Target Budget', data.budget);
            drawField('Move-in Timeline', data.timeline);
            drawField('Parking (C/2W)', `${details.carParking || 0} / ${details.twoWheelerParking || 0}`);

            if (details.additionalNotes) {
                doc.moveDown();
                doc.fillColor('#6B7280').fontSize(10).text('Additional Notes:', 50);
                doc.fillColor('#111827').fontSize(9).text(details.additionalNotes, { width: 500, align: 'justify' });
            }

            // Footer
            const pageCount = doc.bufferedPageRange().count;
            for (let i = 0; i < pageCount; i++) {
                doc.switchToPage(i);
                doc.fillColor('#9CA3AF').fontSize(8).text('Privileged & Confidential - SFT Corporate Requirement', 50, 750, { align: 'center' });
            }

            doc.end();
            stream.on('finish', () => resolve(filePath));
        } catch (err) {
            reject(err);
        }
    });
};

const sendRFPSubmissionEmail = async (rfpData) => {
    try {
        const { companyName, clientName, email, seats, timeline, micromarket, user, details } = rfpData;
        const adminEmail = process.env.ADMIN_EMAIL || 'nikhilkashyapkn@gmail.com';
        const pdfPath = await generateRFPSubmissionPDF(rfpData);

        const clientHtml = `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; border: 1px solid #f0f0f0; padding: 40px; border-radius: 16px; color: #333;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <h1 style="color: #0F766E; margin: 0; font-size: 28px;">RFP Received! 🚀</h1>
                    <p style="color: #666;">We've received your detailed workspace requirement.</p>
                </div>
                
                <p>Hello <b>${clientName || user}</b>,</p>
                <p>Thank you for choosing SFT. We have successfully recorded your RFP for <b>${companyName}</b>. Our team is already working on matching this with our premium workspace partners.</p>
                
                <div style="background: #f8fafc; padding: 25px; border-radius: 12px; margin: 30px 0; border-left: 4px solid #0F766E;">
                    <h3 style="margin-top: 0; color: #0F766E; font-size: 16px; text-transform: uppercase; letter-spacing: 1px;">Requirement Snapshot:</h3>
                    <table style="width: 100%; font-size: 14px; border-collapse: collapse;">
                        <tr><td style="padding: 5px 0; color: #666;">Seats:</td><td style="padding: 5px 0; font-weight: bold;">${seats} Pax</td></tr>
                        <tr><td style="padding: 5px 0; color: #666;">Industry:</td><td style="padding: 5px 0; font-weight: bold;">${details?.industry || 'N/A'}</td></tr>
                        <tr><td style="padding: 5px 0; color: #666;">Location:</td><td style="padding: 5px 0; font-weight: bold;">${micromarket}</td></tr>
                        <tr><td style="padding: 5px 0; color: #666;">Timeline:</td><td style="padding: 5px 0; font-weight: bold;">${timeline}</td></tr>
                    </table>
                </div>

                <p style="font-size: 14px; line-height: 1.6;">You will receive match notifications as soon as workspace partners submit their proposals. A copy of your full brief is attached to this email for your records.</p>
                
                <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #999; text-align: center;">
                    <p>Best Regards,<br><b style="color: #0F766E;">SFT Corporate Solutions Team</b></p>
                </div>
            </div>
        `;

        const adminHtml = `
            <div style="font-family: sans-serif; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px; max-width: 600px; color: #1f2937;">
                <div style="background: #0f766e; padding: 20px; border-radius: 8px 8px 0 0; color: white;">
                    <h2 style="margin: 0; font-size: 20px;">New Detailed RFP Submission 📊</h2>
                </div>
                <div style="padding: 20px; border: 1px solid #eee; border-top: 0; border-radius: 0 0 8px 8px;">
                    <p>A new high-fidelity RFP has been submitted by <b>${companyName}</b>.</p>
                    <div style="background-color: #f9fafb; padding: 15px; border-radius: 6px; margin-top: 20px; font-size: 14px;">
                        <p style="margin: 5px 0;"><b>Industry:</b> ${details?.industry || 'N/A'}</p>
                        <p style="margin: 5px 0;"><b>Contact:</b> ${clientName || user} (${email})</p>
                        <p style="margin: 5px 0;"><b>Requirement:</b> ${seats} Seats in ${micromarket}</p>
                        <p style="margin: 5px 0;"><b>Budget:</b> ${rfpData.budget}</p>
                    </div>
                    <p style="margin-top: 20px; font-size: 14px;">The full requirement brief has been generated as a formal PDF and is attached herewith.</p>
                    <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/admin/rfps" style="display: inline-block; background: #0f766e; color: white; padding: 12px 25px; border-radius: 6px; text-decoration: none; margin-top: 20px; font-weight: bold;">View in Admin Portal</a>
                </div>
            </div>
        `;

        // 1. Send to Client
        await transporter.sendMail({
            from: '"SFT Corporate" <nikhilkashyapkn@gmail.com>',
            to: email,
            subject: 'RFP Submission Received - SFT',
            html: clientHtml
        });

        // 2. Send to Admin
        await transporter.sendMail({
            from: '"SFT Alert" <nikhilkashyapkn@gmail.com>',
            to: adminEmail,
            subject: `New Detailed RFP: ${companyName}`,
            html: adminHtml,
            attachments: [{
                filename: path.basename(pdfPath),
                path: pdfPath
            }]
        });

        console.log('✅ RFP Submission Emails sent successfully with PDF');
    } catch (err) {
        console.error('❌ RFP Submission Email Error:', err);
    }
};

module.exports = sendRFPSubmissionEmail;
