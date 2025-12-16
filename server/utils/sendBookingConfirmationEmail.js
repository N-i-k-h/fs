const Brevo = require('@getbrevo/brevo');
require('dotenv').config();

const sendBookingConfirmationEmail = async ({ user, email, space, seats, price, date, time, totalAmount, address, googleMapsLink }) => {
    try {
        const apiInstance = new Brevo.TransactionalEmailsApi();
        const apiKey = process.env.BREVO_API_KEY;

        if (!apiKey) {
            console.error('❌ Brevo API Key is missing');
            return;
        }

        apiInstance.setApiKey(Brevo.TransactionalEmailsApiApiKeys.apiKey, apiKey);

        const htmlContent = `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; color: #333; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
            <div style="background-color: #0f766e; padding: 20px; text-align: center;">
                <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Booking Confirmed! ✅</h1>
                <p style="color: #ccfbf1; margin-top: 5px; font-size: 14px;">Your workspace request has been approved.</p>
            </div>
            
            <div style="padding: 30px; background-color: #ffffff;">
                <p style="font-size: 16px; margin-bottom: 20px;">Hello <b>${user}</b>,</p>
                <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                    Great news! Your request for workspace at <b>${space}</b> has been accepted. We are excited to host you.
                </p>

                <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; border-left: 4px solid #0f766e;">
                    <h3 style="margin-top: 0; color: #0f766e; font-size: 16px;">Booking Details</h3>
                    <ul style="list-style: none; padding: 0; margin: 0; font-size: 15px; color: #4b5563;">
                        <li style="margin-bottom: 10px;">🏢 <b>Space:</b> ${space}</li>
                        <li style="margin-bottom: 10px;">📅 <b>Date:</b> ${date}</li>
                        <li style="margin-bottom: 10px;">⏰ <b>Time:</b> ${time}</li>
                        <li style="margin-bottom: 10px;">👥 <b>Seats:</b> ${seats}</li>
                        <li style="margin-bottom: 10px;">📍 <b>Location:</b> ${address}</li>
                    </ul>
                </div>

                <div style="margin-top: 20px; text-align: right;">
                    <p style="font-size: 14px; color: #6b7280; margin-bottom: 5px;">Price per seat: ₹${price}</p>
                    <h2 style="color: #0f766e; margin: 0; font-size: 24px;">Total: ₹${totalAmount.toLocaleString()}</h2>
                </div>

                <div style="margin-top: 30px; text-align: center;">
                    <a href="${googleMapsLink}" style="display: inline-block; background-color: #0f766e; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">View on Google Maps 🗺️</a>
                </div>
            </div>

            <div style="background-color: #f9fafb; padding: 15px; text-align: center; font-size: 12px; color: #9ca3af; border-top: 1px solid #e5e7eb;">
                <p>If you have any questions, reply to this email.</p>
                <p>© ${new Date().getFullYear()} FlickSpace. All rights reserved.</p>
            </div>
        </div>
        `;

        await apiInstance.sendTransacEmail({
            sender: {
                name: 'FlickSpace Bookings',
                email: 'nikhilkashyapkn@gmail.com',
            },
            to: [{ email: email, name: user }],
            subject: `Booking Confirmed: ${space} - ${date}`,
            htmlContent: htmlContent,
        });

        console.log(`✅ Booking confirmation email sent to ${email}`);

    } catch (err) {
        console.error('❌ Failed to send booking confirmation email:', err);
    }
};

module.exports = sendBookingConfirmationEmail;
