import { CreateIDDto, IDTypeEnum, VerifyIDDto } from '@/dtos/request/ids.dto';
import { GetIDsResponse } from '@/dtos/response/ids.response';
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
  public async getUserIDs(userId: string): Promise<GetIDsResponse> {
    const id_document = await IDModel.find({ user: userId });
    if (!id_document) {
      throw new HttpException(ErrorEnum.DOCUMENTS_NOT_FOUND);
    }
    return id_document.map((val) => ({
      id: val._id.toString(),
      idType: val.id_type,
      idNumber: val.id_number,
      user: val.user.toString(),
      address: val.normalizedAddress,
      location: val.location.toString(),
      verification: {
        isVerified: val.verification?.is_verified,
        lastUpdated: val.verification?.last_updated,
      },
      createdAt: val.createdAt,
      updatedAt: val.updatedAt,
    }));
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

  private maskString(str: string, numVisibleChars: number): string {
    return `xxxx-xxxx-${str.slice(-numVisibleChars)}`;
  }

  public async requestAadharOtp(userId: string, addIDDto: CreateIDDto) {
    if (await this.userHasId(userId, IDTypeEnum.AADHAR)) {
      throw new HttpException(ErrorEnum.AADHAR_ALREADY_EXIST);
    }

    const { id_number } = addIDDto;
    const taskId = uuidv4();
    await this.otp_rate_limit_check(userId, IDTypeEnum.AADHAR);

    try {
      const otpResponse = await AadhaarVerification.requestOtp(id_number, taskId.toString());
      if (otpResponse.success && otpResponse.response_code === '100') {
        const { request_id, success, response_code, response_message } = otpResponse;
        return { success, response_code, response_message, request_id, taskId };
      } else {
        throw new HttpException(ErrorEnum.AADHAR_VERIFICATION_FAIL, `${otpResponse.response_message}`);
      }
    } catch (e) {
      throw new HttpException(ErrorEnum.AADHAR_VERIFICATION_FAIL, JSON.parse(e)?.response_message);
    }
  }

  private async remoteVerifyAadharOtp(verifyIdDto: VerifyIDDto) {
    const { otp, request_id, task_id } = verifyIdDto;

    try {
      const verificationResponse = await AadhaarVerification.verifyOtp(request_id, otp, task_id);

      return verificationResponse;
    } catch (e) {
      throw new HttpException(ErrorEnum.AADHAR_VERIFICATION_FAIL, JSON.parse(e)?.response_message);
    }
  }

  public async verifyAadharOtp(userId: string, verifyIdDto: VerifyIDDto) {
    if (await this.userHasId(userId, IDTypeEnum.AADHAR)) {
      throw new HttpException(ErrorEnum.AADHAR_ALREADY_EXIST);
    }

    const { success, response_code, response_message, result } = await this.remoteVerifyAadharOtp(verifyIdDto);
    if (success && response_code === '100') {
      const aadhaar_number = result.user_aadhaar_number;
      const user_address = result.user_address;

      result.user_aadhaar_number = this.maskString(result.user_aadhaar_number, 4);

      await IDModel.db.transaction(async (session) => {
        await IDModel.create(
          [
            {
              id_type: IDTypeEnum.AADHAR,
              id_number: aadhaar_number,
              user: userId,
              data: result,
              address: user_address,
              normalizedAddress: {
                address_line_1: `${result.user_address.house}, ${result.user_address.po}`,
                address_line_2: `${result.user_address.landmark}, ${result.user_address.subdist}, ${result.user_address.loc}`,
                city: result.user_address.dist,
                street: result.user_address.street,
                country: result.user_address.country,
                state: result.user_address.state,
                pincode: result.address_zip,
                type: 'permanent'
              },
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
      throw new HttpException(ErrorEnum.AADHAR_VERIFICATION_FAIL, `${response_message}`);
    }
  }

  private async remoteVerifyPan(addIDDto: CreateIDDto) {
    const { id_number } = addIDDto;
    const taskId = uuidv4();

    try {
      const response = await PanVerification.verifyPan(id_number, taskId);

      return response;
    } catch (e) {
      throw new HttpException(ErrorEnum.PAN_VERIFICATION_FAIL, JSON.parse(e)?.response_message);
    }
  }

  public async verifyPan(userId: string, addIDDto: CreateIDDto) {
    if (await this.userHasId(userId, IDTypeEnum.PAN)) {
      throw new HttpException(ErrorEnum.PAN_ALREADY_EXIST);
    }

    if (!(await this.userHasId(userId, IDTypeEnum.AADHAR))) {
      throw new HttpException(ErrorEnum.AADHAR_VERIFICATION_REQUIRED);
    }

    const { success, response_code, response_message, result } = await this.remoteVerifyPan(addIDDto);
    if (success && response_code === '100') {
      await IDModel.create({
        id_type: IDTypeEnum.PAN,
        id_number: addIDDto.id_number,
        user: userId,
        data: result,
        address: result.user_address,
        normalizedAddress: {
          address_line_1: result.user_address.line_1,
          address_line_2: result.user_address.line_2,
          city: result.user_address.city,
          street: result.user_address.street_name,
          country: result.user_address.country,
          state: result.user_address.state,
          pincode: result.user_address.zip,
          type: 'permanent'
        },
      } as ID);

      await profileService.modScore(userId, IDTypeEnum.PAN, true);
      return { success, response_code, response_message };
    } else {
      throw new HttpException(ErrorEnum.PAN_VERIFICATION_FAIL, `${response_message}`);
    }
  }

  private async remoteVerifyDrivingLicense(addIDDto: CreateIDDto) {
    const { id_number, dob } = addIDDto;
    const taskId = uuidv4();

    try {
      const response = await drivinLicenseVerification.verifyDrivingLicense(id_number, dob, taskId);
      return response;
    } catch (e) {
      throw new HttpException(ErrorEnum.DRIVING_LICENSE_VERIFICATION_FAIL, JSON.parse(e)?.response_message);
    }
  }

  public async verifyDrivingLicense(userId: string, addIDDto: CreateIDDto) {
    if (await this.userHasId(userId, IDTypeEnum.PAN)) {
      throw new HttpException(ErrorEnum.DRIVING_LICENSE_ALREADY_EXIST);
    }

    if (!(await this.userHasId(userId, IDTypeEnum.AADHAR))) {
      throw new HttpException(ErrorEnum.AADHAR_VERIFICATION_REQUIRED);
    }

    const { success, response_code, response_message, result } = await this.remoteVerifyDrivingLicense(addIDDto);
    if (success && response_code === '100') {
      const user_address = result.user_address[0];
      await IDModel.create({
        id_type: IDTypeEnum.DRIVING_LICENSE,
        id_number: addIDDto.id_number,
        user: userId,
        data: result,
        address: user_address,
        normalizedAddress: {
          address_line_1: user_address.completeAddress,
          city: user_address.district,
          country: user_address.country,
          state: user_address.state,
          pincode: user_address.pin,
          type: user_address.type
        },
      } as ID);

      await profileService.modScore(userId, IDTypeEnum.DRIVING_LICENSE, true);
      return { success, response_code, response_message };
    } else {
      throw new HttpException(ErrorEnum.DRIVING_LICENSE_VERIFICATION_FAIL, `${response_message}`);
    }
  }
}

export const idsService = new IDsService();
