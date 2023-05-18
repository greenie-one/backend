import { TokenClaims } from '@/dtos/auth.dto';
import { CreateUserDto, LoginDto, ValidateOtpDTO, ValidationType } from '@/dtos/users.dto';
import { ErrorEnum } from '@/exceptions/errorCodes';
import { HttpException } from '@/exceptions/httpException';
import { ProfileModel } from '@/models/profile.model';
import { AuthSessionModel } from '@/models/session.model';
import { User, UserRoles } from '@/models/users.model';
import { redisClient } from '@/redisClient';
import { AuthRemote } from '@/remote/auth/otp.remote';
import { generateOTP } from '@/utils/string';
import { hash } from 'bcryptjs';
import { FastifyRequest } from 'fastify';
import { v4 } from 'uuid';
import { userService } from './users.service';

const OTP_EXPIRY = 5 * 60; // 5mins;
const VALIDATION_EXPIRY = 15 * 60; // 15mins;
class AuthService {
  async createUserDetails(user: User) {
    const profile = await ProfileModel.findOne({
      user: user._id,
    });

    const userDetails: TokenClaims = {
      email: user.email,
      firstName: profile?.firstName,
      lastName: profile?.lastName,
      roles: user.roles,
      userId: user._id,
      sessionId: v4(),
    };

    return userDetails;
  }

  async storeToken(sessionId: string, token: string, refreshToken: string) {
    await AuthSessionModel.create({
      _id: sessionId,
      token,
      refreshToken,
    });
  }

  async removeSession(sessionId: string) {
    const resp = await AuthSessionModel.findById(sessionId);

    if (!resp) {
      throw new HttpException(ErrorEnum.SESSION_NON_EXISTENT);
    }
  }

  async validateSessionId(sessionId: string, token: string, type: 'token' | 'refreshToken') {
    const resp = await AuthSessionModel.findById(sessionId);
    return resp[type] === token;
  }

  async updateAccessTokenInStore(sessionId: string, accessToken: string) {
    await AuthSessionModel.updateOne(
      { _id: sessionId },
      {
        token: accessToken,
      },
    );
  }

  async createTempUser(request: CreateUserDto): Promise<string> {
    const existingUser = await userService.findUser({ email: request.email, mobileNumber: request.mobileNumber });
    if (existingUser) throw new HttpException(ErrorEnum.USER_ALREADY_EXISTS);

    const validationId = v4();
    const user: User = {
      email: request.email,
      mobileNumber: request.mobileNumber,
      password: request.password && (await hash(request.password, 10)),
      roles: [UserRoles.DEFAULT],
    };
    const type = ValidationType.SINGUP;
    const data = { type, user };

    await redisClient.setEx(`validation_${validationId}`, VALIDATION_EXPIRY, JSON.stringify(data));
    return validationId;
  }

  async loadTempUser(request: LoginDto): Promise<string> {
    const validationId = v4();

    let user: User;
    if (request.mobileNumber) {
      user = await userService.validateByPhoneNumber(request.mobileNumber);
    } else {
      user = await userService.validateUserByEmail(request.email, request.password);
    }

    const type = ValidationType.LOGIN;
    const data = { type, user };

    await redisClient.setEx(`validation_${validationId}`, VALIDATION_EXPIRY, JSON.stringify(data));
    return validationId;
  }

  async validate(request: ValidateOtpDTO) {
    const data = await redisClient.get(`validation_${request.validationId}`);
    if (data) {
      const { type, user } = JSON.parse(data) as { user: User; type: ValidationType };

      if (await this.validateOTP(user, request.otp)) {
        redisClient.del(`validation_${request.validationId}`);
        if (type === ValidationType.SINGUP) {
          return userService.createUser(user);
        }

        if (type === ValidationType.LOGIN) {
          return user;
        }
      }
    }
    throw new HttpException(ErrorEnum.INVALID_VALIDATION_ID);
  }

  async requestOTPByValidationId(validationId: string) {
    const data = await redisClient.get(`validation_${validationId}`);
    if (data) {
      const { user } = JSON.parse(data) as { user: User; type: ValidationType };
      const type = user.mobileNumber ? 'MOBILE_NUMBER' : 'EMAIL';
      return this.requestOTP(user.mobileNumber ?? user.email, type);
    }
    throw new HttpException(ErrorEnum.INVALID_VALIDATION_ID);
  }

  async requestOTP(contact: string, type: 'EMAIL' | 'MOBILE_NUMBER') {
    const otp = generateOTP();

    await redisClient.setEx(`${contact}_otp`, OTP_EXPIRY, otp);

    if (type === 'MOBILE_NUMBER') await AuthRemote.requestOtpMobile(contact, otp);
    else await AuthRemote.requestOtpEmail(contact, otp);
  }

  private async validateOTP(user: User, otp: string) {
    const data = await redisClient.get(`${user.mobileNumber || user.email}_otp`);
    if (otp === data) {
      redisClient.del(`${user.mobileNumber || user.email}_otp`);
      return true;
    }
    return false;
  }

  async generateTokens(req: FastifyRequest, user: User) {
    const userDetails = await this.createUserDetails(user);

    try {
      const accessToken = req.server.jwt.sign(userDetails, { expiresIn: '30m', algorithm: 'RS256' });
      const refreshToken = req.server.jwt.sign({ ...userDetails, isRefresh: true }, { algorithm: 'RS256', expiresIn: '60d' });

      await this.storeToken(userDetails.sessionId, accessToken, refreshToken);

      return { accessToken, refreshToken };
    } catch (e) {
      this.removeSession(userDetails.sessionId).catch(console.error);
      throw e;
    }
  }

  async refreshToken(req: FastifyRequest, token: string) {
    try {
      const decoded: TokenClaims = req.server.jwt.verify(token);
      if (decoded.isRefresh) {
        const user = await userService.findUser({ id: decoded.userId });
        const userDetails = await this.createUserDetails(user);

        const accessToken = req.server.jwt.sign(userDetails, { expiresIn: '30m', algorithm: 'RS256' });

        await this.updateAccessTokenInStore(userDetails.sessionId, accessToken);

        return { accessToken };
      }
    } catch (e) {
      console.error(e);
    }

    throw new HttpException(ErrorEnum.INVALID_REFRESH_TOKEN);
  }
}

export const authService = new AuthService();
