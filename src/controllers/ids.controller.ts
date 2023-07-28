import { TokenClaims } from '@/dtos/request/auth.dto';
import { CreateIDDto, VerifyIDDto } from '@/dtos/request/ids.dto';
import {
  GetIDsResponse,
} from '@/dtos/response/ids.response';
import { AadharRequestOtpResponse, AadharVerifyResponse } from '@/remote/dtos/aadhar.response';
import { DrivingLicenseVerifyResponse } from '@/remote/dtos/driving.response';
import { PanVerifyResponse } from '@/remote/dtos/pan.response';
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
  public async requestAadharOtp(@UserDetails() userDetails: TokenClaims, @Body() addIDDto: CreateIDDto): Promise<Partial<AadharRequestOtpResponse>> {
    return idsService.requestAadharOtp(userDetails.sub, addIDDto);
  }

  @Post('/aadhar/verify-otp')
  public async verifyAadharOtp(@UserDetails() userDetails: TokenClaims, @Body() verifyIdDto: VerifyIDDto): Promise<Partial<AadharVerifyResponse>> {
    return idsService.verifyAadharOtp(userDetails.sub, verifyIdDto);
  }

  @Post('/pan/verify')
  public async verifyPan(@UserDetails() userDetails: TokenClaims, @Body() addIDDto: CreateIDDto): Promise<Partial<PanVerifyResponse>> {
    return idsService.verifyPan(userDetails.sub, addIDDto);
  }

  @Post('/driving-license/verify')
  public async verifyDrivingLicense(@UserDetails() userDetails: TokenClaims, @Body() addIDDto: CreateIDDto): Promise<Partial<DrivingLicenseVerifyResponse>> {
    return idsService.verifyDrivingLicense(userDetails.sub, addIDDto);
  }
}
