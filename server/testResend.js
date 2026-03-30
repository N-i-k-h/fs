const { Resend } = require('resend');

const resend = new Resend('re_jL4ZZswK_vDi3G73TjSNhzKXmPsVHoJE8');

(async function() {
  const { data, error } = await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: 'nikhilkashyapkn@gmail.com',
    subject: 'Resend Platform Test - SFT',
    html: '<strong>Success!</strong> Resend API is now integrated with SFT. Test mail received.'
  });

  if (error) {
    return console.error({ error });
  }

  console.log({ data });
})();
