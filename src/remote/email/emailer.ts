import { Waitlist } from '@models/waitlist.model';
import nodemailer from 'nodemailer';

// Create a function to send an email to a waitlist member
export const sendWaitlistEmail = async (waitlist: Waitlist) => {
  // Create a transporter object to send the email
  const transporter = nodemailer.createTransport({
    host: 'smtp.example.com',
    port: 587,
    secure: false,
    auth: {
      user: 'your-email@example.com',
      pass: 'your-email-password',
    },
  });

  // Define the email message
  const message = {
    from: 'your-email@example.com',
    to: waitlist.email,
    subject: 'You have been added to the waitlist',
    text: `Hello ${waitlist.name},\n\nThank you for joining our waitlist. We will notify you when a spot becomes available.\n\nBest,\nThe Waitlist Team`,
  };

  // Send the email
  const info = await transporter.sendMail(message);

  console.log('Email sent: %s', info.messageId);
};
