import { TokenClaims } from '@/dtos/auth.dto';
import { CreateUserDto, LoginDto } from '@/dtos/users.dto';
import { HttpException } from '@/exceptions/httpException';
import { authService } from '@/services/auth.service';
import { AuthGuard } from '@/utils/decorators/auth';
import { Controller } from '@/utils/decorators/controller';
import { Get, Post } from '@/utils/decorators/methods';
import { Body, Query, Req } from '@/utils/decorators/request';
import { FastifyRequest } from 'fastify';

@Controller()
export class AuthController {
  @Post('/signup')
  async signup(@Body() createUserRequest: CreateUserDto) {
    return authService.createUser(createUserRequest);
  }

  @Post('/login')
  async login(@Body() loginRequest: LoginDto, @Req() req: FastifyRequest) {
    const userDetails = await authService.createUserDetails(loginRequest);

    try {
      const accessToken = req.server.jwt.sign(userDetails, { expiresIn: '30m', algorithm: 'RS256' });
      const refreshToken = req.server.jwt.sign({ ...userDetails, isRefresh: true, algorithm: 'RS256' });

      await authService.storeToken(userDetails.sessionId, accessToken, refreshToken);

      return { accessToken, refreshToken };
    } catch (e) {
      authService.removeSession(userDetails.sessionId).catch(console.error);
      throw e;
    }
  }

  @AuthGuard()
  @Post('/logout')
  async logout(@Req() req: FastifyRequest) {
    const sessionId = (req.user as TokenClaims).sessionId;
    authService.removeSession(sessionId);
  }

  @Get('/refresh')
  async refreshToken(@Req() req: FastifyRequest, @Query('refreshToken') token: string) {
    const decoded: TokenClaims = req.server.jwt.verify(token);
    if (decoded.isRefresh) {
      delete decoded.isRefresh;
      if (await authService.validateSessionId(decoded.sessionId, token, 'refreshToken')) {
        const accessToken = req.server.jwt.sign(decoded, { expiresIn: '30m', algorithm: 'RS256' });
        await authService.updateAccessTokenInStore(decoded.sessionId, accessToken);
        return { accessToken };
      }
    }

    throw new HttpException('Unauthorized', 401);
  }
}
