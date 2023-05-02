import { env } from '@/config';
import fs from 'fs';
import nodemailer from 'nodemailer';

let keyFileContents;
const keyFilePath = './keys/googleapi/service-account-key.json';
if (env('APP_ENV') == 'local') {
  keyFileContents = fs.readFileSync(keyFilePath, 'utf8');
} else {
  keyFileContents = env('google-service-account-key');
}
const keyFileJson = JSON.parse(keyFileContents);

export const transporter = nodemailer.createTransport({
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
