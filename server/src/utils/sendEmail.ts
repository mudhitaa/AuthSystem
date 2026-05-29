import { BrevoClient } from '@getbrevo/brevo';

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

const brevo = new BrevoClient({
  apiKey: process.env.BREVO_API_KEY ?? '',
});

const sendEmail = async ({
  to,
  subject,
  html,
}: SendEmailOptions): Promise<void> => {
  await brevo.transactionalEmails.sendTransacEmail({
    subject,
    htmlContent: html,
    sender: {
      name: process.env.EMAIL_FROM_NAME ?? 'App',
      email: process.env.EMAIL_FROM_ADDRESS ?? 'inejandnina@gmail.com',
    },
    to: [{ email: to }],
  });
};

export default sendEmail;