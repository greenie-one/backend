import { HttpException } from '@/exceptions/httpException';
import { TokenClaims } from '@/interfaces/auth.interface';
import { AuthSessionModel } from '@/models/session.model';
import { v4 } from 'uuid';

class AuthService {
  async createUserDetails() {
    const userDetails: TokenClaims = {
      email: 'abcd@gmail.com',
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

  async validateSessionId(sessionId: string) {
    const resp = await AuthSessionModel.findById(sessionId);
    return !!resp;
  }

  async updateAccessTokenInStore(sessionId: string, accessToken: string) {
    await AuthSessionModel.updateOne({
      _id: sessionId,
      token: accessToken,
    });
  }
}

export const authService = new AuthService();
