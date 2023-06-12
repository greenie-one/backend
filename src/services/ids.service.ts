import { AddIDDto } from '@/dtos/ids.dto';
import { ErrorEnum } from '@/exceptions/errorCodes';
import { HttpException } from '@/exceptions/httpException';
import { ID, IDModel, IDTypeEnum } from '@/models/id.model';
import { UserModel } from '@/models/users.model';
import { AadhaarVerification } from '@/remote/verification/aadhar.remote';

class IDsService {
  public async getUserIDs(userId: string): Promise<ID[]> {
    const id_document: ID[] = await IDModel.find({ user: userId });
    if (!id_document) {
      throw new HttpException(ErrorEnum.DOCUMENTS_NOT_FOUND);
    }
    return id_document;
  }

  public async verifyAadhaar(userId: string, idData: AddIDDto) {
    // Create a new ID document
    const id = await UserModel.create({
      id_number: idData.id_number,
      id_type: idData.id_type,
      user: userId,
    });

    // Request OTP
    try {
      const response = await AadhaarVerification.requestOtp(idData.id_number, id._id);
      idData.request_id = response.request_id;
      // Return the updated idData or modify it as per your requirement
      if (idData.request_id && idData.otp) {
        // Verify OTP
        try {
          const response = await AadhaarVerification.verifyOtp(idData.request_id, idData.otp, id._id);
          // Handle the response and return the result
          return response;
        } catch (error) {
          // Handle the error
          throw new HttpException(ErrorEnum.API_ERROR, error.message);
        }
      }
      return idData;
    } catch (error) {
      // Handle the error
      throw new HttpException(ErrorEnum.API_ERROR, error.message);
    }
  }

  public async verifyId(userId: string, idData: AddIDDto) {
    try {
      // Check if user exists
      const findUser = await UserModel.findById(userId);
      if (!findUser) {
        throw new HttpException(ErrorEnum.USER_NOT_FOUND);
      }
    } catch (e) {
      throw new HttpException(ErrorEnum.USER_NOT_FOUND);
    }

    if (idData.id_type === IDTypeEnum.AADHAR) {
      return this.verifyAadhaar(userId, idData);
    }
  }
}

export const idsService = new IDsService();
