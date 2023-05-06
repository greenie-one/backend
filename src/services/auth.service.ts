import { TokenClaims } from '@/dtos/auth.dto';
import { CreateUserDto, LoginDto, ValidateOtpDTO, ValidationType } from '@/dtos/users.dto';
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
      throw new HttpException('Session does not exist', 400);
    }
  }

  async validateSessionId(sessionId: string, token: string, type: 'token' | 'refreshToken') {
    const resp = await AuthSessionModel.findById(sessionId);
    return resp[type] === token;
  }

  async updateAccessTokenInStore(sessionId: string, accessToken: string) {
    await AuthSessionModel.updateOne({
      _id: sessionId,
      token: accessToken,
    });
  }

  async createTempUser(request: CreateUserDto): Promise<string> {
    const existingUser = await userService.findUser(request.email, request.mobileNumber);
    if (existingUser) throw new HttpException('User already exists', 409);

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
    const data = await redisClient.getDel(`validation_${request.validationId}`);
    if (data) {
      const { type, user } = JSON.parse(data) as { user: User; type: ValidationType };

      if (await this.validateOTP(user, request.otp)) {
        if (type === ValidationType.SINGUP) {
          return userService.createUser(user);
        }

        if (type === ValidationType.LOGIN) {
          return user;
        }
      }
    }
    throw new HttpException('Invalid validation ID', 400);
  }

  async requestOTP(mobileNumber: string) {
    const otp = generateOTP();

    await redisClient.setEx(`${mobileNumber}_otp`, OTP_EXPIRY, otp);
    await AuthRemote.requestOtp(mobileNumber, otp);
  }

  private async validateOTP(user: User, otp: string) {
    if (user.mobileNumber) {
      const data = await redisClient.getDel(`${user.mobileNumber}_otp`);
      return otp === data;
    }

    if (user.email) {
      return true;
    }

    return false;
  }

  async generateTokens(req: FastifyRequest, user: User) {
    const userDetails = await authService.createUserDetails(user);

    try {
      const accessToken = req.server.jwt.sign(userDetails, { expiresIn: '30m', algorithm: 'RS256' });
      const refreshToken = req.server.jwt.sign({ ...userDetails, isRefresh: true }, { algorithm: 'RS256', expiresIn: '60d' });

      await authService.storeToken(userDetails.sessionId, accessToken, refreshToken);

      return { accessToken, refreshToken };
    } catch (e) {
      authService.removeSession(userDetails.sessionId).catch(console.error);
      throw e;
    }
  }
}

export const authService = new AuthService();
