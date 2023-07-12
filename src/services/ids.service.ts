import { AddIDDto, VerifyIDDto } from '@/dtos/ids.dto';
import { ErrorEnum } from '@/exceptions/errorCodes';
import { HttpException } from '@/exceptions/httpException';
import { ID, IDModel, IDTypeEnum } from '@/models/id.model';
import { redisClient } from '@/redisClient';
import { AadhaarVerification } from '@/remote/verification/aadhar.remote';
import { drivinLicenseVerification } from '@/remote/verification/drivingLicense.remote';
import { PanVerification } from '@/remote/verification/pan.remote';
import { v4 as uuidv4 } from 'uuid';
import { locationService } from './location.service';
import { profileService } from './profile.service';

const OTP_LIMIT = 5;
const VALIDATION_LIMIT = 10 * 60; // mins;

class IDsService {
  public async getUserIDs(userId: string): Promise<ID[]> {
    const id_document: ID[] = await IDModel.find({ user: userId });
    if (!id_document) {
      throw new HttpException(ErrorEnum.DOCUMENTS_NOT_FOUND);
    }
    return id_document;
  }

  public async otp_rate_limit_check(userId: string, id_type: IDTypeEnum) {
    const key = `${userId}-${id_type}-otp-count`;
    const exists = await redisClient.get(key);
    if (!exists) {
      await redisClient.setEx(key, VALIDATION_LIMIT, '1');
    }
    const current = await redisClient.incr(key);
    if (current > OTP_LIMIT) {
      throw new HttpException(ErrorEnum.RATE_LIMIT_EXCEEDED);
    }
  }

  public async requestAadharOtp(userId: string, addIDDto: AddIDDto) {
    const { id_number } = addIDDto;
    const taskId = uuidv4();

    await this.otp_rate_limit_check(userId, IDTypeEnum.AADHAR);

    const otpResponse = await AadhaarVerification.requestOtp(id_number, taskId.toString()).catch((err) => {
      console.log(err);
      throw new HttpException(ErrorEnum.Aadhaar_Verification_FAIL, `Internal API Error`);
    });

    if (otpResponse.success && otpResponse.response_code === '100') {
      const { request_id, success, response_code, response_message } = otpResponse;
      return { success, response_code, response_message, request_id, taskId };
    } else {
      throw new HttpException(ErrorEnum.Aadhaar_Verification_FAIL, `${otpResponse.response_message}`);
    }
  }

  public async verifyAadharOtp(userId: string, verifyIdDto: VerifyIDDto) {
    const { otp, request_id, task_id } = verifyIdDto;

    const newId = await IDModel.findOne({ user: userId, id_type: IDTypeEnum.AADHAR });

    if (newId) {
      throw new HttpException(ErrorEnum.AADHAR_ALREADY_EXIST);
    }

    const verificationResponse = await AadhaarVerification.verifyOtp(request_id, otp, task_id).catch((err) => {
      console.log(err);
      throw new HttpException(ErrorEnum.Aadhaar_Verification_FAIL, `Internal API Error`);
    });

    if (verificationResponse.success && verificationResponse.response_code === '100') {
      const aadhaar_number = verificationResponse.result.user_aadhaar_number;
      const user_address = verificationResponse.result.user_address;
      const address = { address: user_address, type: IDTypeEnum.AADHAR };
      const location = await locationService.getCoordinates(userId, IDTypeEnum.AADHAR, address.toString());
      await IDModel.create({
        id_type: IDTypeEnum.AADHAR,
        id_number: aadhaar_number,
        user: userId,
        location: location.locationId,
        id_data: verificationResponse,
      });

      const { success, response_code, response_message } = verificationResponse;

      if (success) {
        // Update score based on document uploaded
        await profileService.modScore(userId, IDTypeEnum.AADHAR, true);
      }

      return { success, response_code, response_message };
    } else {
      throw new HttpException(ErrorEnum.Aadhaar_Verification_FAIL, `${verificationResponse.response_message}`);
    }
  }

  public async verifyPan(userId: string, addIDDto: AddIDDto) {
    const { id_number } = addIDDto;
    const taskId = uuidv4();

    const newId = await IDModel.findOne({ user: userId, id_type: IDTypeEnum.PAN });
    if (newId) {
      throw new HttpException(ErrorEnum.PAN_ALREADY_EXIST);
    }

    const AadharId = await IDModel.findOne({ user: userId, id_type: IDTypeEnum.AADHAR });

    if (!AadharId) {
      throw new HttpException(ErrorEnum.AADHAR_VERIFICATION_REQUIRED);
    }
    const response = await PanVerification.verifyPan(id_number, taskId).catch((err) => {
      console.error(err);
      throw new HttpException(ErrorEnum.PAN_VERIFICATION_FAIL, `Internal API Error`);
    });

    if (response.success && response.response_code === '100') {
      const user_address = response.result.user_address;
      const address = { address: user_address, type: IDTypeEnum.PAN };

      const location = await locationService.getCoordinates(userId, IDTypeEnum.PAN, address.toString());
      await IDModel.create({
        id_type: IDTypeEnum.PAN,
        id_number: addIDDto.id_number,
        user: userId,
        location: location.locationId,
        id_data: response,
      });

      const { success, response_code, response_message } = response;

      if (success) {
        // Update score based on document uploaded
        await profileService.modScore(userId, IDTypeEnum.PAN, true);
      }

      return { success, response_code, response_message };
    } else {
      throw new HttpException(ErrorEnum.PAN_VERIFICATION_FAIL, `${response.response_message}`);
    }
  }

  public async verifyDrivingLicense(userId: string, addIDDto: AddIDDto) {
    const { id_number, dob } = addIDDto;
    const taskId = uuidv4();

    const newId = await IDModel.findOne({ user: userId, id_type: IDTypeEnum.DRIVING_LICENSE });

    if (newId) {
      throw new HttpException(ErrorEnum.DRIVING_LICENSE_ALREADY_EXIST);
    }

    const AadharId = await IDModel.findOne({ user: userId, id_type: IDTypeEnum.AADHAR });

    if (!AadharId) {
      throw new HttpException(ErrorEnum.AADHAR_VERIFICATION_REQUIRED);
    }

    const response = await drivinLicenseVerification.verifyDrivingLicense(id_number, dob, taskId).catch((err) => {
      console.error(err);
      throw new HttpException(ErrorEnum.DRIVING_LICENSE_VERIFICATION_FAIL, `Internal API Error`);
    });

    if (response.success && response.response_code === '100') {
      const user_address = response.result.user_address[0];
      const address = { address: user_address, type: IDTypeEnum.DRIVING_LICENSE };
      // console.log(address);
      const location = await locationService.getCoordinates(userId, IDTypeEnum.DRIVING_LICENSE, address.toString());
      await IDModel.create({
        id_type: IDTypeEnum.DRIVING_LICENSE,
        id_number: addIDDto.id_number,
        user: userId,
        location: location.locationId,
        id_data: response,
      });

      const { success, response_code, response_message } = response;

      if (success) {
        // Update score based on document uploaded
        await profileService.modScore(userId, IDTypeEnum.DRIVING_LICENSE, true);
      }

      return { success, response_code, response_message };
    } else {
      throw new HttpException(ErrorEnum.DRIVING_LICENSE_VERIFICATION_FAIL, `${response.response_message}`);
    }
  }
}

export const idsService = new IDsService();
