import { TokenClaims } from '@/dtos/request/auth.dto';
import { AddIDDto, VerifyIDDto } from '@/dtos/request/ids.dto';
import { idsService } from '@/services/ids.service';
import { UserDetails } from '@/utils/decorators/auth';
import { Controller } from '@/utils/decorators/controller';
import { Get, Post } from '@/utils/decorators/methods';
import { Body } from '@/utils/decorators/request';

@Controller('/ids')
export default class IDsController {
  @Get('/me')
  public async getUserIDs(@UserDetails() userDetails: TokenClaims) {
    const userId = userDetails.sub;
    const ids = await idsService.getUserIDs(userId);
    return { ids };
  }

  @Post('/aadhar/request-otp')
  public async requestAadharOtp(@UserDetails() userDetails: TokenClaims, @Body() addIDDto: AddIDDto) {
    return idsService.requestAadharOtp(userDetails.sub, addIDDto);
  }

  @Post('/aadhar/verify-otp')
  public async verifyAadharOtp(@UserDetails() userDetails: TokenClaims, @Body() verifyIdDto: VerifyIDDto) {
    return idsService.verifyAadharOtp(userDetails.sub, verifyIdDto);
  }

  @Post('/pan/verify')
  public async verifyPan(@UserDetails() userDetails: TokenClaims, @Body() addIDDto: AddIDDto) {
    return idsService.verifyPan(userDetails.sub, addIDDto);
  }

  @Post('/driving-license/verify')
  public async verifyDrivingLicense(@UserDetails() userDetails: TokenClaims, @Body() addIDDto: AddIDDto) {
    return idsService.verifyDrivingLicense(userDetails.sub, addIDDto);
  }
}

