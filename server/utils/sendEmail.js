const { sendWelcomeEmail, notifyAdminOfActivity } = require('./emailService');

const sendWelcomeEmailWrapper = async (userEmail, userName) => {
    await sendWelcomeEmail(userEmail, userName);
    await notifyAdminOfActivity(userEmail, userName, 'Login');
};

module.exports = sendWelcomeEmailWrapper;
