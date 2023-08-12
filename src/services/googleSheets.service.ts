import { addUserInfoDTO } from "@/dtos/request/googleSheets.dto";
import { ErrorEnum } from '@/exceptions/errorCodes';
import { HttpException } from '@/exceptions/httpException';
import { sheets } from "@/remote/google/sheets/sheets";


class GoogleSheetsService {
  public async addData(hrEmail: string, data: addUserInfoDTO): Promise<any> {
    try {
      return sheets.addData(hrEmail, data.name, data.email, data.phone);
    } catch (error) {
      throw new HttpException(ErrorEnum.DOCUMENT_NOT_FOUND);
    }
    
  }
}

export const googleSheetsService = new GoogleSheetsService();
