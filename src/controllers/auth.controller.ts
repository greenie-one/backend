import { HttpException } from '@/exceptions/httpException';
import { TokenClaims } from '@/interfaces/auth.interface';
import { AuthService } from '@/services/auth.service';
import { AuthGuard } from '@/utils/decorators/auth';
import { Controller } from '@/utils/decorators/controller';
import { Get, Post } from '@/utils/decorators/methods';
import { Query, Req } from '@/utils/decorators/request';
import { FastifyRequest } from 'fastify';

@Controller()
export class AuthController {
  private authService = new AuthService();

  @Post('/signup')
  async signup() {
    // TODO: Add to user DB
  }

  @Post('/login')
  async login(req: FastifyRequest) {
    const userDetails = await this.authService.createUserDetails();

    try {
      const accessToken = req.server.jwt.sign(userDetails, { expiresIn: '30m' });
      const refreshToken = req.server.jwt.sign({ ...userDetails, isRefresh: true });

      await this.authService.storeToken(userDetails.sessionId, accessToken, refreshToken);

      return { accessToken, refreshToken };
    } catch (e) {
      this.authService.removeSession(userDetails.sessionId).catch(console.error);
      throw e;
    }
  }

  @AuthGuard()
  @Post('/logout')
  async logout(@Req() req: FastifyRequest) {
    const sessionId = (req.user as TokenClaims).sessionId;
    this.authService.removeSession(sessionId);
  }

  @Get('/refresh')
  async refreshToken(@Req() req: FastifyRequest, @Query('refreshToken') token: string) {
    const decoded: TokenClaims = req.server.jwt.verify(token);
    if (decoded.isRefresh) {
      delete decoded.isRefresh;
      if (await this.authService.validateSessionId(decoded.sessionId)) {
        const accessToken = req.server.jwt.sign(decoded, { expiresIn: '30m' });
        await this.authService.updateAccessTokenInStore(decoded.sessionId, accessToken);
        return { accessToken };
      }
    }

    throw new HttpException('Unauthorized', 401);
  }
}
