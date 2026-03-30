const { sendWelcomeEmail, notifyAdminOfActivity } = require('./emailService');

/**
 * Legacy wrapper for Brevo replacement
 */
const sendWelcomeEmailLegacy = async (userEmail, userName) => {
    await sendWelcomeEmail(userEmail, userName);
    // Also notify admin as per legacy behavior
    await notifyAdminOfActivity(userEmail, userName, 'Registration');
};

module.exports = sendWelcomeEmailLegacy;
