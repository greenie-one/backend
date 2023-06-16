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

    const otpResponse = await AadhaarVerification.requestOtp(id_number, taskId.toString());

    if (otpResponse.success && otpResponse.response_code === '100') {
      const { request_id, success, response_code, response_message } = otpResponse;
      return { success, response_code, response_message, request_id, taskId };
    } else {
      throw new HttpException(ErrorEnum.Aadhaar_Verification_FAIL, `${otpResponse.response_message}`);
    }
  }

  public async verifyAadharOtp(userId: string, verifyIdDto: VerifyIDDto) {
    const { otp, request_id, task_id } = verifyIdDto;

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
      throw new HttpException(ErrorEnum.Aadhaar_Verification_FAIL, `${verificationResponse.response_message}`);
    }
  }

  public async verifyPan(userId: string, addIDDto: AddIDDto) {
    const { id_number } = addIDDto;
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
      throw new HttpException(ErrorEnum.PAN_VERIFICATION_FAIL, `${response.response_message}`);
    }
  }

  public async verifyDrivingLicense(userId: string, addIDDto: AddIDDto) {
    const { id_number, dob } = addIDDto;
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
      throw new HttpException(ErrorEnum.DRIVING_LICENSE_VERIFICATION_FAIL, `${response.response_message}`);
    }
  }
}

export const idsService = new IDsService();
