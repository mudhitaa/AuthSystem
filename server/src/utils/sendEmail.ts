import nodemailer from 'nodemailer';

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

// Explicit SMTP config instead of service: 'Gmail'

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,       
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,  
  },
  
  tls: {
    rejectUnauthorized: true,
  },
});


if (process.env.NODE_ENV === 'production') {
  transporter.verify((error) => {
    if (error) {
      console.error(' SMTP transporter verification failed:', error.message);
    } else {
      console.log('SMTP transporter ready');
    }
  });
}

const sendEmail = async ({ to, subject, html }: SendEmailOptions): Promise<void> => {
  await transporter.sendMail({
    from: `"${process.env.APP_NAME ?? 'App'}" <${process.env.EMAIL_FROM ?? process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
};

export default sendEmail;