import { Waitlist } from '@models/waitlist.model';
import nodemailer from 'nodemailer';
import key from '../../../keys/mail/keys.json';

const YOUR_EMAIL_ADDRESS = 'info@greenie.com';

// Create a function to send an email to a waitlist member
export const sendWaitlistEmail = async (waitlist: Waitlist) => {
  // Create a transporter object to send the email
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,

    auth: {
      type: 'OAuth2',
      user: YOUR_EMAIL_ADDRESS,
      serviceClient: key.client_id,
      privateKey: key.private_key,
    },
  });

  // Define the email message
  const message = {
    from: YOUR_EMAIL_ADDRESS,
    to: waitlist.email,
    subject: 'You have been added to the waitlist',
    text: `Hello ${waitlist.name},\n\nThank you for joining our waitlist. We will notify you when a spot becomes available.\n\nBest,\nThe Waitlist Team`,
  };

  // Send the email
  const info = await transporter.sendMail(message);

  console.log('Email sent: %s', info.messageId);
};
