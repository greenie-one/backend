import { addUserInfoDTO } from '@/dtos/request/googleSheets.dto';
import { addUserInfoResponse } from '@/dtos/response/googleSheets.response';
import { ErrorEnum } from '@/exceptions/errorCodes';
import { HttpException } from '@/exceptions/httpException';
import { sheets } from '@/remote/google/sheets/sheets';

class GoogleSheetsService {
  public async addData(hrEmail: string, data: addUserInfoDTO): Promise<addUserInfoResponse> {
    try {
      await sheets.addData(hrEmail, data.name, data.email, data.phone, data.message);
      const res: addUserInfoResponse = { success: true };
      return res;
    } catch (error) {
      throw new HttpException(ErrorEnum.DATA_NOT_ADDED);
    }
  }
}

export const googleSheetsService = new GoogleSheetsService();
