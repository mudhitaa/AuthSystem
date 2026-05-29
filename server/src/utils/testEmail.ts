import 'dotenv/config';
import sendEmail from './sendEmail';

sendEmail({
  to: 'inejandnina@gmail.com',
  subject: 'Brevo test',
  html: '<p>If you see this, Brevo is working correctly!</p>',
})
  .then(() => console.log('✅ Email sent successfully'))
  .catch((err) => console.error('❌ Failed:', err));