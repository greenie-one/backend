import { HttpClient } from '@/remote/generic/httpClient';
import { GoogleAuth } from 'google-auth-library';
import { keys } from '../../../../keys/googleapi/keys';
import { env } from '@/config';

async function getAccessToken() {
  const auth = new GoogleAuth({
    credentials: keys,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const client = await auth.getClient();
  const token = await client.getAccessToken();

  return token;
}
export class sheets {
  static async addData(hrEmail, userName, userEmail, userPhone) {
    const accessToken = await getAccessToken();
    const sheetID = env('google-spreadsheet-id');

    const values = [[hrEmail, userName, userEmail, userPhone]];

    const response = HttpClient.callApi({
      url: `https://sheets.googleapis.com/v4/spreadsheets/${sheetID}/values/Sheet1:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken.token}`,
      },
      body: {
        values,
      },
    });

    return response;
  }
}
