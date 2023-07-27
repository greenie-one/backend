import { OtpType } from '@/dtos/request/otp.dto';
import { ErrorEnum } from '@/exceptions/errorCodes';
import { HttpException } from '@/exceptions/httpException';
import { redisClient } from '@/redisClient';
import { Otp } from '@/remote/otp/otp';

class OTPService {
  public async sendOTP(contact: string, type: OtpType) {
    try {
      const resp = await Otp.sendOtp({ contact, type });
      redisClient.setEx(`${contact}-${type.valueOf()}`, 60 * 5, resp.otp.toString());

    } catch (e) {
      console.error(e);
      throw new HttpException(ErrorEnum.SERVER_ERROR);
    }
  }

  public async verifyOTP(contact: string, type: OtpType, otp: string) {
    const otpFromRedis = await redisClient.get(`${contact}-${type.valueOf()}`);
    if (otpFromRedis === otp) {
      return true;
    }
    throw new HttpException(ErrorEnum.INVALID_OTP);
  }
}

export const otpService = new OTPService();
