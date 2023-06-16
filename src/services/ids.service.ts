import { AddIDDto, VerifyIDDto } from '@/dtos/ids.dto';
import { ErrorEnum } from '@/exceptions/errorCodes';
import { HttpException } from '@/exceptions/httpException';
import { ID, IDModel, IDTypeEnum } from '@/models/id.model';
import { AadhaarVerification } from '@/remote/verification/aadhar.remote';
import { drivinLicenseVerification } from '@/remote/verification/drivingLicense.remote';
import { PanVerification } from '@/remote/verification/pan.remote';
import { v4 as uuidv4 } from 'uuid';

class IDsService {
  public async getUserIDs(userId: string): Promise<ID[]> {
    const id_document: ID[] = await IDModel.find({ user: userId });
    if (!id_document) {
      throw new HttpException(ErrorEnum.DOCUMENTS_NOT_FOUND);
    }
    return id_document;
  }

  public async requestAadharOtp(userId: string, addIDDto: AddIDDto) {
    const { id_number } = addIDDto;
    const taskId = uuidv4();
    try {
      const otpResponse = await AadhaarVerification.requestOtp(id_number, taskId.toString());
      const requestId = otpResponse.request_id;
      if (!otpResponse.result.is_number_linked) {
        throw new HttpException(ErrorEnum.NUMBER_NOT_LINKED);
      }
      if (!otpResponse.result.is_aadhaar_valid) {
        throw new HttpException(ErrorEnum.AADHAR_NOT_FOUND);
      }
      return { requestId, taskId };
    } catch (error) {
      throw new HttpException(ErrorEnum.AADHAR_NOT_FOUND);
    }
  }

  public async verifyAadharOtp(userId: string, verifyIdDto: VerifyIDDto) {
    const { otp, request_id, task_id } = verifyIdDto;

    try {
      const verificationResponse = await AadhaarVerification.verifyOtp(request_id, otp, task_id);

      if (verificationResponse.success && verificationResponse.response_code === '100') {
        const aadhaar_number = verificationResponse.result.user_aadhaar_number;
        // console.log(aadhaar_number);
        const documentId = IDModel.create({
          id_type: IDTypeEnum.AADHAR,
          id_number: aadhaar_number,
          user: userId,
          id_data: verificationResponse,
        });

        console.log(documentId);
        const { success, response_code, response_message } = verificationResponse;
        return { success, response_code, response_message };
      } else {
        throw new HttpException(ErrorEnum.Aadhaar_Verification_FAIL);
      }
    } catch (error) {
      throw new HttpException(ErrorEnum.Aadhaar_Verification_FAIL);
    }
  }

  public async verifyPan(userId: string, addIDDto: AddIDDto) {
    const { id_number } = addIDDto;

    try {
      const taskId = uuidv4();
      const response = await PanVerification.verifyPan(id_number, taskId);
      console.log(response);

      if (response.success && response.response_code === '100') {
        await IDModel.create({
          id_type: IDTypeEnum.PAN,
          id_number: addIDDto.id_number,
          user: userId,
          id_data: response,
        });

        const { success, response_code, response_message } = response;
        return { success, response_code, response_message };
      } else {
        throw new HttpException(ErrorEnum.PAN_VERIFICATION_FAIL);
      }
    } catch (error) {
      throw new HttpException(ErrorEnum.PAN_VERIFICATION_FAIL);
    }
  }

  public async verifyDrivingLicense(userId: string, addIDDto: AddIDDto) {
    const { id_number, dob } = addIDDto;

    try {
      const taskId = uuidv4();
      const response = await drivinLicenseVerification.verifyDrivingLicense(id_number, dob, taskId);
      console.log(response);

      if (response.success && response.response_code === '100') {
        await IDModel.create({
          id_type: IDTypeEnum.DRIVING_LICENSE,
          id_number: addIDDto.id_number,
          user: userId,
          id_data: response,
        });
        const { success, response_code, response_message } = response;
        return { success, response_code, response_message };
      } else {
        throw new HttpException(ErrorEnum.DRIVING_LICENSE_VERIFICATION_FAIL);
      }
    } catch (error) {
      throw new HttpException(ErrorEnum.DRIVING_LICENSE_VERIFICATION_FAIL);
    }
  }
}

export const idsService = new IDsService();
