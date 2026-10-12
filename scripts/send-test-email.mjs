// Sends one test email through Resend to confirm RESEND_API_KEY works.
//
// Usage:  RESEND_API_KEY=re_... node scripts/send-test-email.mjs [to-address]
//
// Until your domain is verified in Resend, the sandbox sender
// (onboarding@resend.dev) can only deliver to the email address your Resend
// account was created with. After verifying a domain, set RESEND_FROM to an
// address on it (e.g. "Technically Creative <no-reply@auth.technicallycreative.work>").
import { Resend } from 'resend';

const apiKey = process.env.RESEND_API_KEY;
if (!apiKey) {
  console.error('Set RESEND_API_KEY first (Resend dashboard > API Keys).');
  process.exit(1);
}

const resend = new Resend(apiKey);

const { data, error } = await resend.emails.send({
  from: process.env.RESEND_FROM ?? 'onboarding@resend.dev',
  to: process.argv[2] ?? 'contact@technicallycreative.work',
  subject: 'Hello World',
  html: '<p>Congrats on sending your <strong>first email</strong>!</p>',
});

if (error) {
  console.error('Resend rejected the email:', error);
  process.exit(1);
}

console.log('Sent! Email id:', data.id);
