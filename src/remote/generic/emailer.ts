import { env } from '@/config';
import fs from 'fs';
import nodemailer from 'nodemailer';

interface Message {
  to: string;
  from: string;
  subject: string;
  text?: string;
  html?: string;
}

class Mailer {
  private transporter: nodemailer.Transporter;

  constructor() {
    const keyFileContents = env('google-service-account-key', null) ?? fs.readFileSync('./keys/local/googleapi/service-account-key.json', 'utf8');

    const keyFileJson = JSON.parse(keyFileContents);

    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        type: 'OAuth2',
        user: 'office@greenie.one',
        serviceClient: keyFileJson.client_id,
        privateKey: keyFileJson.private_key,
      },
    });
  }

  public async sendMail(mailOptions: Omit<Message, 'from'>) {
    return this.transporter.sendMail({
      ...mailOptions,
      from: 'Greenie <office@greenie.one>',
    });
  }
}

export const mailer = new Mailer();
