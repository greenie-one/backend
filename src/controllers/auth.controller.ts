import { TokenClaims } from '@/dtos/auth.dto';
import { CreateUserDto, LoginDto, ValidateOtpDTO } from '@/dtos/users.dto';
import { HttpException } from '@/exceptions/httpException';
import { User } from '@/models/users.model';
import { authService } from '@/services/auth.service';
import { userService } from '@/services/users.service';
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

  private async generateTokens(req: FastifyRequest, user: User) {
    const userDetails = await authService.createUserDetails(user);

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

  @Post('/login')
  async login(@Body() loginRequest: LoginDto, @Req() request: FastifyRequest) {
    if (loginRequest.mobileNumber) {
      await userService.validateByPhoneNumber(loginRequest.mobileNumber);
      return 'Sent OTP';
    }

    if (loginRequest.email) {
      const user = await userService.validateUserByEmail(loginRequest.email, loginRequest.password);
      return this.generateTokens(request, user);
    }
  }

  @Post('/validateOTP')
  async validateOtp(@Body() validateOtpRequest: ValidateOtpDTO, @Req() request: FastifyRequest) {
    console.debug('Got OTP request', validateOtpRequest);

    const user = await userService.validateByPhoneNumber(validateOtpRequest.mobileNumber);

    if (await authService.validateOTP()) {
      return this.generateTokens(request, user);
    } else {
      throw new HttpException('Invalid OTP', 401);
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
