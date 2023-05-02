import { Waitlist } from '@models/waitlist.model';
import { transporter } from './transporter';

const YOUR_EMAIL_ADDRESS = 'info@greenie.one';

export const sendWaitlistEmail = async (waitlist: Waitlist) => {
  const message = {
    from: YOUR_EMAIL_ADDRESS,
    to: waitlist.email,
    subject: 'You have been added to the waitlist',
    text: `Hello ${waitlist.name},\n\nThank you for joining our waitlist. We will notify you when a spot becomes available.\n\nBest,\nThe Waitlist Team`,
  };

  const info = await transporter.sendMail(message);

  console.log('Email sent: %s', info.messageId);
};
