import { TokenClaims } from '@/dtos/auth.dto';
import { CreateUserDto, LoginDto, ValidateOtpDTO } from '@/dtos/users.dto';
import { HttpException } from '@/exceptions/httpException';
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

  @Post('/login')
  async login(@Body() loginRequest: LoginDto, @Req() request: FastifyRequest) {
    if (loginRequest.mobileNumber) {
      await userService.validateByPhoneNumber(loginRequest.mobileNumber);
      await authService.requestOTP(loginRequest.mobileNumber);
      return 'Sent OTP';
    }

    if (loginRequest.email) {
      const user = await userService.validateUserByEmail(loginRequest.email, loginRequest.password);
      return authService.generateTokens(request, user);
    }
  }

  @Post('/validateOTP')
  async validateOtp(@Body() validateOtpRequest: ValidateOtpDTO, @Req() request: FastifyRequest) {
    const user = await userService.validateByPhoneNumber(validateOtpRequest.mobileNumber);

    if (await authService.validateOTP(validateOtpRequest.mobileNumber, validateOtpRequest.otp)) {
      return authService.generateTokens(request, user);
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
