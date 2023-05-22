import { TokenClaims } from '@/dtos/auth.dto';
import { CreateUserDto, LoginDto, ResendOtpDTO, ValidateOtpDTO } from '@/dtos/users.dto';
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
    const validationId = await authService.createTempUser(createUserRequest);
    authService.requestOTP(createUserRequest.mobileNumber || createUserRequest.email, createUserRequest.mobileNumber ? 'MOBILE_NUMBER' : 'EMAIL');
    return { validationId };
  }

  @Post('/login')
  async login(@Body() loginRequest: LoginDto) {
    const validationId = await authService.loadTempUser(loginRequest);
    authService.requestOTP(loginRequest.mobileNumber || loginRequest.email, loginRequest.mobileNumber ? 'MOBILE_NUMBER' : 'EMAIL');
    return { validationId };
  }

  @Post('/resendOTP')
  async resendOtp(@Body() validateOtpRequest: ResendOtpDTO) {
    await authService.requestOTPByValidationId(validateOtpRequest.validationId);
  }

  @Post('/validateOTP')
  async validateOtp(@Body() validateOtpRequest: ValidateOtpDTO, @Req() request: FastifyRequest) {
    const user = await authService.validate(validateOtpRequest);
    if (user) {
      return authService.generateTokens(request, user);
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
    return authService.refreshToken(req, token);
  }
}
