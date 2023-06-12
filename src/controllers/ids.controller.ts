import { TokenClaims } from '@/dtos/auth.dto';
import { AddIDDto } from '@/dtos/ids.dto';
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
  public async verifyAadharOtp(@UserDetails() userDetails: TokenClaims, @Body() addIDDto: AddIDDto) {
    return idsService.verifyAadharOtp(userDetails.sub, addIDDto);
  }
}
