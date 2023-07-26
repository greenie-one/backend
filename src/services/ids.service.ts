import { AddIDDto, IDTypeEnum, VerifyIDDto } from '@/dtos/request/ids.dto';
import { ErrorEnum } from '@/exceptions/errorCodes';
import { HttpException } from '@/exceptions/httpException';
import { ID, IDModel } from '@/models/id.model';
import { redisClient } from '@/redisClient';
import { AadhaarVerification } from '@/remote/verification/aadhar.remote';
import { drivinLicenseVerification } from '@/remote/verification/drivingLicense.remote';
import { PanVerification } from '@/remote/verification/pan.remote';
import { v4 as uuidv4 } from 'uuid';
import { profileService } from './profile.service';

const OTP_LIMIT = 5;
const VALIDATION_LIMIT = 60 * 10; // mins;

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

  private async userHasId(userId: string, idType: IDTypeEnum) {
    return !!(await IDModel.findOne({
      user: userId,
      id_type: idType,
    }));
  }

  public async requestAadharOtp(userId: string, addIDDto: AddIDDto) {
    if (await this.userHasId(userId, IDTypeEnum.AADHAR)) {
      throw new HttpException(ErrorEnum.AADHAR_ALREADY_EXIST);
    }

    const { id_number } = addIDDto;
    const taskId = uuidv4();
    await this.otp_rate_limit_check(userId, IDTypeEnum.AADHAR);

    const otpResponse = await AadhaarVerification.requestOtp(id_number, taskId.toString()).catch((err) => {
      throw new HttpException(ErrorEnum.AADHAR_VERIFICATION_FAIL, JSON.parse(err)?.response_message);
    });

    if (otpResponse.success && otpResponse.response_code === '100') {
      const { request_id, success, response_code, response_message } = otpResponse;
      return { success, response_code, response_message, request_id, taskId };
    } else {
      throw new HttpException(ErrorEnum.AADHAR_VERIFICATION_FAIL, `${otpResponse.response_message}`);
    }
  }

  public async verifyAadharOtp(userId: string, verifyIdDto: VerifyIDDto) {
    const { otp, request_id, task_id } = verifyIdDto;

    if (await this.userHasId(userId, IDTypeEnum.AADHAR)) {
      throw new HttpException(ErrorEnum.AADHAR_ALREADY_EXIST);
    }

    const verificationResponse = await AadhaarVerification.verifyOtp(request_id, otp, task_id).catch((err) => {
      console.log(err);
      throw new HttpException(ErrorEnum.AADHAR_VERIFICATION_FAIL, JSON.parse(err)?.response_message);
    });

    const { success, response_code, response_message, result } = verificationResponse;
    if (success && response_code === '100') {
      const aadhaar_number = result.user_aadhaar_number;
      const user_address = result.user_address;

      await IDModel.db.transaction(async (session) => {
        await IDModel.create(
          [
            {
              id_type: IDTypeEnum.AADHAR,
              id_number: aadhaar_number,
              user: userId,
              address: user_address,
            },
          ],
          {
            session,
          },
        );

        await profileService.modScore(userId, IDTypeEnum.AADHAR, true, session);
        await profileService.generateGreenieId(userId, session);
      });

      return { success, response_code, response_message };
    } else {
      throw new HttpException(ErrorEnum.AADHAR_VERIFICATION_FAIL, `${verificationResponse.response_message}`);
    }
  }

  public async verifyPan(userId: string, addIDDto: AddIDDto) {
    const { id_number } = addIDDto;
    const taskId = uuidv4();

    if (await this.userHasId(userId, IDTypeEnum.PAN)) {
      throw new HttpException(ErrorEnum.PAN_ALREADY_EXIST);
    }

    if (!(await this.userHasId(userId, IDTypeEnum.AADHAR))) {
      throw new HttpException(ErrorEnum.AADHAR_VERIFICATION_REQUIRED);
    }

    const response = await PanVerification.verifyPan(id_number, taskId).catch((err) => {
      throw new HttpException(ErrorEnum.PAN_VERIFICATION_FAIL, JSON.parse(err)?.response_message);
    });

    const { success, response_code, response_message } = response;
    if (success && response_code === '100') {
      await IDModel.create({
        id_type: IDTypeEnum.PAN,
        id_number: addIDDto.id_number,
        user: userId,
        address: response.result.user_address,
      } as ID);

      await profileService.modScore(userId, IDTypeEnum.PAN, true);
      return { success, response_code, response_message };
    } else {
      throw new HttpException(ErrorEnum.PAN_VERIFICATION_FAIL, `${response.response_message}`);
    }
  }

  public async verifyDrivingLicense(userId: string, addIDDto: AddIDDto) {
    const { id_number, dob } = addIDDto;
    const taskId = uuidv4();

    if (await this.userHasId(userId, IDTypeEnum.PAN)) {
      throw new HttpException(ErrorEnum.DRIVING_LICENSE_ALREADY_EXIST);
    }

    if (!(await this.userHasId(userId, IDTypeEnum.AADHAR))) {
      throw new HttpException(ErrorEnum.AADHAR_VERIFICATION_REQUIRED);
    }

    const response = await drivinLicenseVerification.verifyDrivingLicense(id_number, dob, taskId).catch((err) => {
      throw new HttpException(ErrorEnum.DRIVING_LICENSE_VERIFICATION_FAIL, JSON.parse(err)?.response_message);
    });

    const { success, response_code, response_message } = response;
    if (success && response_code === '100') {
      const user_address = response.result.user_address[0];

      await IDModel.create({
        id_type: IDTypeEnum.DRIVING_LICENSE,
        id_number: addIDDto.id_number,
        user: userId,
        address: user_address,
      } as ID);

      await profileService.modScore(userId, IDTypeEnum.DRIVING_LICENSE, true);
      return { success, response_code, response_message };
    } else {
      throw new HttpException(ErrorEnum.DRIVING_LICENSE_VERIFICATION_FAIL, `${response.response_message}`);
    }
  }
}

export const idsService = new IDsService();
