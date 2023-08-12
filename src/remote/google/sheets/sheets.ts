import { env } from '@/config';
import fs from 'fs';
import { google } from 'googleapis';

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

const keyFileContents = env('google-service-account-key', null) ?? fs.readFileSync('./keys/local/googleapi/service-account-key.json', 'utf8');

const keyFileJson = JSON.parse(keyFileContents);

const credentials = {
  type: 'service_account',
  project_id: 'greenieproject',
  private_key_id: '65773a40249d29cedd5a486cb1bb6d20f6925a11',
  private_key: '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDzDj9gLcFZr5qs\nC+NHGWxuIqveZpEPtiH993lYYV420Ws5L5q1xFoqMUue6AIZwfVJh82JsnuPJU5O\nz4w1dX2AXjeylMirXqa4hdS+5Vl6s3WgcG3ZWA1YqUYJKTtmTIA0X4UtT5vjldkl\nHhjwygDKBTV0KFidTtIIY75e7Bz/KlkYkRrGCVCSy5y61x4u6A9+1gq9uenLt/24\nhehluo14XMqC4fGGedJi6IIfp25ouE9su07Z0fiCGzsnyj8LVe8ISzZe21LjqwrE\nsdE21rDYBi8TQDXmgFQW3tckCDLiA0gN+ndybB8cGJwOhR/Zx8JkCH3xBWp8LmB9\nEukG9+XxAgMBAAECggEAEomvJsBGo3cDxoR/mLAlN384eZV8EeUz0YF7BVUj0O2H\nDo0FcUChGd+5o0yRwHItKacMc6ijyOaxAszMplUoNc6508qKRZvJ/n/imo62lOe0\nHIEGt9GB7xW2DEPTTnmeO6BfcXXFb4XB0pVplI/roHzmN05Od+0HkvE8l1PN4F4t\n8Wlabyj16kGsruELELpIWPmn0qMMRUSa5WVsr5u2UKYxZhBpWWICcnVxeVzM7Knc\nR8NS1Z1Hsj4gBZqqI29wBVXG/BoG/55XI12my4cn/sc65Lbfway/cWlJNWXgfQlv\nPPXAUAKoGNXvsCsDrlExqu8janqQOZcs8Pmqj2vuIQKBgQD6WfmSxm5aDzdK0JVP\n7s0r/lojVZV0bdisFDKP0V9qKIFUumaLK6sGkVs+D45W5EyEuQB/MQz9XSvcDHf7\nsvX3348gtncXV1zJMPyDt1cGRSKFCXcWddplaqgRbtY1QgAs6f56jVgXl7XXGDbH\nu25vJPx4ZR2CG7N6UVfQmoLfSQKBgQD4iiHYoukwyTO7G9JqQ57+rx2MyraHiC6+\n280OHFaIUNR3fFWiB/lj9Ja38pV6sppMWPH3EpmjDXzQlpZQ3Gd4g+H+QjDOqB+2\nv0cUOuXxNABWBbNH7FvRUXLXfucRhtFwSqB6SEIkr0boMWXvxp+X62WHN8KWPsKF\nrGDaJCrJaQKBgHdGltmPINRXm4hRiFHk/GuRa3CaPfKSw0B4/v32SvdRBQ1RIbn8\nvCcM6ePPlYlgi/RQECSJQh8UXOkiJ6gLw5StNovnYyYDwXk5lZVLrHKYTbIEqHBT\nBhJ7lkd3/yawo1TCxzOsU+Qpq8EnEDJo4lyhyoex5TUv7XrBdo00kFXBAoGATg7c\nGHT59heLBr3zNOqt+eE3z6su7pwnykuwODlQOBni0PAc2PnWKr17xKQMrG+BpG7e\n97FAzYQD6mMRLK48VQ5eoQNa3tzQsQ2cHk9tPncNj/bUWsdyAuiov+OcYNXN242k\nnyMomurtwykYkdj48La+uVwa4iMt5tu/w2NOiNkCgYEAn6u9ExkF+3lrswAFVkaD\nEfWsatccXYCnYnF/jDZwl2EQg/UvBI3BifJIbfaL5CQ21vlciksXa2ErgF+00i+z\noAsL7V7Ce9m4wKROvvEm35mNd48WfwDJ5pIi91BLQMnY+yo5TH0xesNIA92845h5\nDoLy0y/Zsj3YxzwezksacZU=\n-----END PRIVATE KEY-----\n',
  client_email: 'google-sheets@greenieproject.iam.gserviceaccount.com',
  client_id: '101486709149994574822',
  auth_uri: 'https://accounts.google.com/o/oauth2/auth',
  token_uri: 'https://oauth2.googleapis.com/token',
  auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
  client_x509_cert_url: 'https://www.googleapis.com/robot/v1/metadata/x509/google-sheets%40greenieproject.iam.gserviceaccount.com',
  universe_domain: 'googleapis.com'
};

export class sheets {
  static async addData(hrEmail, userName, userEmail, userPhone) {
    const auth = new google.auth.GoogleAuth({
      keyFile: keyFileContents,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"]
    })
    const sheets = google.sheets('v4');
    const spreadsheetId = env('google-spreadsheet-id', null);
    const values = [
      [hrEmail, userName, userEmail, userPhone]
    ];
    const range = 'Sheet1';
    console.log(spreadsheetId);
    const response = sheets.spreadsheets.values.append({
      auth: auth,
      spreadsheetId,
      range,
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
      resource: {
        values,
      },
    });

    return response;
  }
}


