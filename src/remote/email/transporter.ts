import fs from 'fs';
import nodemailer from 'nodemailer';

const keyFilePath = './keys/googleapi/service-account-key.json';
const keyFileContents = fs.readFileSync(keyFilePath, 'utf8');
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
