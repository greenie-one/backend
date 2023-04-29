import { TokenClaims } from '@/dtos/auth.dto';
import { CreateUserDto } from '@/dtos/users.dto';
import { HttpException } from '@/exceptions/httpException';
import { ProfileModel } from '@/models/profile.model';
import { AuthSessionModel } from '@/models/session.model';
import { User } from '@/models/users.model';
import { AuthRemote } from '@/remote/auth/otp.remote';
import { v4 } from 'uuid';
import { userService } from './users.service';

class AuthService {
  async createUserDetails(user: User) {
    const profile = await ProfileModel.findOne({
      user: user._id,
    });

    const userDetails: TokenClaims = {
      email: user.email,
      firstName: profile.first_name,
      lastName: profile.last_name,
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

  async createUser(request: CreateUserDto) {
    return userService.createUser(request);
  }

  async validateOTP() {
    return AuthRemote.validateOtp();
  }
}

export const authService = new AuthService();
