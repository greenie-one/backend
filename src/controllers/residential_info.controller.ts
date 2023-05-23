import { TokenClaims } from '@/dtos/auth.dto';

import { AuthGuard, UserDetails } from '@/utils/decorators/auth';
import { Controller } from '@/utils/decorators/controller';
import { Get, Post } from '@/utils/decorators/methods';
import { Body } from '@/utils/decorators/request';

import { AddResidentialInfoDto, UpdateResidentialInfoDto } from '@/dtos/residential_info.dto';
import { ResidentialInfoService } from '@services/residential_info.service';

@Controller('/residential_info')
export default class ResidentialInfoController {
  public residentialInfoService: ResidentialInfoService = new ResidentialInfoService();

  @Get('/me')
  @AuthGuard()
  public async findAUserResidentialInfo(@UserDetails() userDetails: TokenClaims) {
    const userId = userDetails.userId;
    const residentialInfo = await this.residentialInfoService.findAUserResidentialInfo(userId);
    return { data: residentialInfo, message: 'residential info found' };
  }

  @Post('/add')
  @AuthGuard()
  public async addResidentialInfo(@UserDetails() userDetails: TokenClaims, @Body() residentialInfoData: AddResidentialInfoDto) {
    const userId = userDetails.userId;
    const residentialInfo = await this.residentialInfoService.addResidentialInfo(userId, residentialInfoData);
    return { data: residentialInfo, message: 'residential info added' };
  }

  @Post('/update')
  @AuthGuard()
  public async updateResidentialInfo(@UserDetails() userDetails: TokenClaims, @Body() residentialInfoData: UpdateResidentialInfoDto) {
    const userId = userDetails.userId;
    const residentialInfo = await this.residentialInfoService.updateResidentialInfo(userId, residentialInfoData);
    return { data: residentialInfo, message: 'residential info updated' };
  }
}
