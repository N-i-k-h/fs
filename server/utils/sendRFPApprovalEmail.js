const resend = require('./resend');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const generateRFPPDF = (rfp, space, broker) => {
    return new Promise((resolve, reject) => {
        try {
            const data = typeof rfp.details === 'string' ? JSON.parse(rfp.details) : rfp.details || {};
            const doc = new PDFDocument({ margin: 50 });
            const fileName = `RFP_Summary_${rfp.companyName?.replace(/\s/g, '_')}_${rfp._id.toString().slice(-4)}.pdf`;
            const filePath = path.join(__dirname, '..', 'tmp', fileName);

            if (!fs.existsSync(path.join(__dirname, '..', 'tmp'))) {
                fs.mkdirSync(path.join(__dirname, '..', 'tmp'));
            }

            const stream = fs.createWriteStream(filePath);
            doc.pipe(stream);

            // 🎨 Header - Professional Branding
            doc.fillColor('#0F766E').fontSize(22).text('SFT CORPORATE RFP SUMMARY', { align: 'center', bold: true });
            doc.moveDown(0.2);
            doc.fillColor('#94A3B8').fontSize(8).text(`GENERATED ON: ${new Date().toLocaleString()} | REF: ${rfp._id}`, { align: 'center' });
            doc.moveDown();
            doc.strokeColor('#F1F5F9').lineWidth(1).moveTo(50, doc.y).lineTo(550, doc.y).stroke();
            doc.moveDown();

            const addSectionHeader = (title) => {
                doc.moveDown();
                doc.fillColor('#1E293B').fontSize(14).text(title.toUpperCase(), { underline: true });
                doc.moveDown(0.5);
            };

            const addField = (label, value) => {
                const val = (value && value !== 'undefined' && value !== '0' && value !== 0) ? String(value) : 'Not Specified';
                doc.fillColor('#1E293B').fontSize(10).text(`${label}: `, { continued: true }).fillColor('#64748B').text(val);
                doc.moveDown(0.3);
            };

            // 🏢 Section 1: Client Profile
            addSectionHeader('Client Profile');
            addField('Company Name', data.companyName || rfp.companyName);
            addField('Industry', data.industry);
            addField('Funding Status', data.fundingStatus);
            addField('Authorized SPOC', data.clientName || rfp.user);
            addField('SPOC Contact', `${rfp.email} | ${rfp.phone || data.phone}`);
            addField('Company Desc', data.companyDescription);

            // 🛰️ Section 2: Space Requirements
            addSectionHeader('Space Requirements');
            addField('Preferred Location', data.preferredLocation || rfp.micromarket);
            addField('Solution Type', Array.isArray(data.solutionType) ? data.solutionType.join(', ') : data.solutionType);
            addField('Total Seats', `${rfp.seats} Pax`);
            addField('Expansion Space', data.expansionSeats ? `${data.expansionSeats} Seats` : null);
            addField('Lease Period', data.leasePeriod);
            addField('Lock-in Period', data.lockInPeriod);
            addField('Working Hours', data.workingHours);

            // 🏗️ Section 3: Layout & Infrastructure
            addSectionHeader('Layout Specifications');
            addField('Manager Cabins', data.managerCabins);
            if (data.meetingRooms) {
                const mrs = Object.entries(data.meetingRooms)
                    .filter(([_, v]) => Number(v) > 0)
                    .map(([k, v]) => `${k.replace('pax', '')} Pax: ${v}`)
                    .join(' | ');
                addField('Meeting Rooms', mrs);
            }
            addField('Server Room', data.serverRoomRequired ? 'Required' : 'Not Essential');
            addField('Pantry Type', data.pantryType);
            addField('Key Amenities', Array.isArray(data.amenities) ? data.amenities.join(', ') : data.amenities);

            // 💰 Section 4: Commercials & Timeline
            addSectionHeader('Commercials & Timeline');
            addField('Target Budget', `${data.budgetRange || rfp.budget} ${data.budgetType || 'per seat'}`);
            addField('Move-in Timeline', data.expectedMoveIn || rfp.timeline);
            addField('Parking Needs', `Cars: ${data.carParking || 0} / 2W: ${data.twoWheelerParking || 0}`);
            addField('Additional Notes', data.additionalNotes);

            // 🏠 Section 5: Matched Property
            addSectionHeader('Approved Property');
            addField('Office Name', space.name);
            addField('Location', `${space.location}, ${space.city}`);
            addField('Approved Partner', `${broker.name} (${broker.email})`);

            doc.moveDown(2);
            doc.strokeColor('#F1F5F9').lineWidth(1).moveTo(50, doc.y).lineTo(550, doc.y).stroke();
            doc.moveDown(0.5);
            doc.fillColor('#94A3B8').fontSize(8).text('© 2026 SFT Connect. All Rights Reserved. Confidential Corporate Document.', { align: 'center' });

            doc.end();
            stream.on('finish', () => resolve(filePath));
        } catch (err) {
            reject(err);
        }
    });
};


const sendRFPApprovalEmail = async ({ rfp, space, broker }) => {
    try {
        const adminEmail = process.env.ADMIN_EMAIL || 'nikhilkashyapkn@gmail.com';
        const pdfPath = await generateRFPPDF(rfp, space, broker);
        const pdfContent = fs.readFileSync(pdfPath);

        const htmlContent = `
            <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 12px; color: #1f2937;">
                <div style="background: #0f766e; padding: 25px; border-radius: 10px; color: white; text-align: center;">
                    <h2 style="margin: 0;">RFP Approved! 🤝</h2>
                    <p style="margin: 5px 0; opacity: 0.9;">Great news! Your requirement has been successfully matched.</p>
                </div>
                
                <div style="padding: 20px; border: 1px solid #f3f4f6; border-top: 0; border-radius: 0 0 10px 10px;">
                    <p>Hello,</p>
                    <p>We are pleased to inform you that the RFP for <strong>${rfp.companyName || 'Corporate Requirement'}</strong> has been approved and matched with a premium workspace partner.</p>
                    
                    <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #0f766e;">
                        <h3 style="margin-top: 0; color: #111827; font-size: 16px;">Workspace Matrix:</h3>
                        <p style="margin: 5px 0;"><strong>🏢 Property:</strong> ${space.name}</p>
                        <p style="margin: 5px 0;"><strong>📍 Location:</strong> ${space.location}, ${space.city}</p>
                        <p style="margin: 5px 0;"><strong>🤝 Partner:</strong> ${broker.name} (${broker.email})</p>
                    </div>

                    <p style="font-size: 14px;">Please find the detailed RFP attachment for your reference. Our team will contact you shortly to finalize site visits.</p>
                </div>
            </div>
        `;

        await resend.emails.send({
            from: 'SFT Corporate <onboarding@resend.dev>',
            to: [rfp.email, broker.email, adminEmail],
            subject: `RFP Approved: ${rfp.companyName || 'Requirement'} x ${space.name}`,
            html: htmlContent,
            attachments: [{ filename: path.basename(pdfPath), content: pdfContent }]
        });

        console.log('✅ RFP Approval Email sent via Resend');
    } catch (err) {
        console.error('❌ Resend RFP Approval Email Error:', err);
    }
};

module.exports = sendRFPApprovalEmail;
