import { env } from '@/config';
import { plainToInstance } from 'class-transformer';
import { IsNotEmpty, IsString, validate } from 'class-validator';
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
}

export class Mailer {
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

  public async sendMail(mailOptions: Message) {
    if (!(mailOptions instanceof Message)) {
      mailOptions = plainToInstance(Message, mailOptions as Message);
    }

    await validate(mailOptions);
    return this.transporter.sendMail(mailOptions);
  }
}

export const mailer = new Mailer();
