import { TokenClaims } from '@/dtos/request/auth.dto';
import { CreateIDDto, VerifyIDDto } from '@/dtos/request/ids.dto';
import {
  AadharRequestOtpResponse,
  AadharVerifyOtpResponse,
  DrivingLicenseVerifyResponse,
  GetIDsResponse,
  PanVerifyResponse,
} from '@/dtos/response/ids.response';
import { idsService } from '@/services/ids.service';
import { UserDetails } from '@/utils/decorators/auth';
import { Controller } from '@/utils/decorators/controller';
import { Get, Post } from '@/utils/decorators/methods';
import { Body } from '@/utils/decorators/request';

@Controller('/ids')
export default class IDsController {
  @Get('/me')
  public async getUserIDs(@UserDetails() userDetails: TokenClaims): Promise<GetIDsResponse> {
    return await idsService.getUserIDs(userDetails.sub);
  }

  @Post('/aadhar/request-otp')
  public async requestAadharOtp(@UserDetails() userDetails: TokenClaims, @Body() addIDDto: CreateIDDto): Promise<AadharRequestOtpResponse> {
    return idsService.requestAadharOtp(userDetails.sub, addIDDto);
  }

  @Post('/aadhar/verify-otp')
  public async verifyAadharOtp(@UserDetails() userDetails: TokenClaims, @Body() verifyIdDto: VerifyIDDto): Promise<AadharVerifyOtpResponse> {
    return idsService.verifyAadharOtp(userDetails.sub, verifyIdDto);
  }

  @Post('/pan/verify')
  public async verifyPan(@UserDetails() userDetails: TokenClaims, @Body() addIDDto: CreateIDDto): Promise<PanVerifyResponse> {
    return idsService.verifyPan(userDetails.sub, addIDDto);
  }

  @Post('/driving-license/verify')
  public async verifyDrivingLicense(@UserDetails() userDetails: TokenClaims, @Body() addIDDto: CreateIDDto): Promise<DrivingLicenseVerifyResponse> {
    return idsService.verifyDrivingLicense(userDetails.sub, addIDDto);
  }
}
