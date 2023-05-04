import { env } from '@/config';
import { IsNotEmpty, IsString, validateSync } from 'class-validator';
import fs from 'fs';
import nodemailer from 'nodemailer';

export class Message {
  @IsString()
  @IsNotEmpty()
  to: string;

  @IsString()
  @IsNotEmpty()
  from: string;

  @IsString()
  subject: string;

  text: string;

  constructor(mailOptions: unknown) {
    const mailOptionsObj = mailOptions as object;
    Object.assign(this, mailOptionsObj);
    const errors = validateSync(this);
    if (errors.length > 0) {
      throw new Error(`Validation failed: ${errors.join(', ')}`);
    }
  }
}

export class Mailer {
  private transporter: nodemailer.Transporter;

  constructor() {
    const keyFileContents =
      env('APP_ENV') == 'local' ? fs.readFileSync('./keys/googleapi/service-account-key.json', 'utf8') : env('google-service-account-key');

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

  public sendMail(mailOptions: unknown) {
    const message = new Message(mailOptions);
    return this.transporter.sendMail(message);
  }
}

export default new Mailer();
