import { TokenClaims } from '@/dtos/auth.dto';
import { CreateUserDto, LoginDto } from '@/dtos/users.dto';
import { HttpException } from '@/exceptions/httpException';
import { ProfileModel } from '@/models/profile.model';
import { AuthSessionModel } from '@/models/session.model';
import { v4 } from 'uuid';
import { userService } from './users.service';

class AuthService {
  async createUserDetails(loginRequest: LoginDto) {
    // Throw if invalid user
    const user = await userService.validateUser(loginRequest);

    const profile = await ProfileModel.findOne({
      user: user.id,
    });

    const userDetails: TokenClaims = {
      email: loginRequest.email,
      firstName: profile.first_name,
      lastName: profile.last_name,
      roles: user.roles,
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
}

export const authService = new AuthService();
