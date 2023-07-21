import { OtpType } from '@/dtos/request/otp.dto';
import { ErrorEnum } from '@/exceptions/errorCodes';
import { HttpException } from '@/exceptions/httpException';
import { redisClient } from '@/redisClient';
import { Otp } from '@/remote/otp/otp';

class OTPService {
  generateRandomNumber() {
    const minm = 100000;
    const maxm = 999999;
    return Math.floor(Math.random() * (maxm - minm + 1)) + minm;
  }

  public async sendOTP(contact: string, type: OtpType) {
    const otp = this.generateRandomNumber();
    redisClient.setEx(`${contact}-${type.valueOf()}`, 60 * 5, otp.toString());
    await Otp.sendOtp({ contact, type, otp: otp.toString() }).catch((err) => {
      console.error(err);
      throw new HttpException(ErrorEnum.SERVER_ERROR);
    });
  }

  public async verifyOTP(contact: string, type: OtpType, otp: string) {
    const otpFromRedis = await redisClient.get(`${contact}-${type.valueOf()}`).catch((err) => {
      console.error(err);
      throw new HttpException(ErrorEnum.SERVER_ERROR);
    });
    if (otpFromRedis === otp) {
      return true;
    }
    throw new HttpException(ErrorEnum.INVALID_OTP);
  }
}

export const otpService = new OTPService();

