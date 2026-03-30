const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY || 're_jL4ZZswK_vDi3G73TjSNhzKXmPsVHoJE8');

module.exports = resend;
