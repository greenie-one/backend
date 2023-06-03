import { TokenClaims } from '@/dtos/auth.dto';

import { UserDetails } from '@/utils/decorators/auth';
import { Controller } from '@/utils/decorators/controller';
import { Get, Patch, Post } from '@/utils/decorators/methods';
import { Body } from '@/utils/decorators/request';

import { AddResidentialInfoDto, UpdateResidentialInfoDto } from '@/dtos/residentialInfo.dto';
import { residentialInfoService } from '@/services/residentialInfo.service';

@Controller('/residential_info')
export default class ResidentialInfoController {
  @Get('/me')
  public async findAUserResidentialInfo(@UserDetails() userDetails: TokenClaims) {
    const userId = userDetails.sub;
    const residentialInfo = await residentialInfoService.getUserResidentialInfo(userId);
    return { residentialInfo };
  }

  @Post('/')
  public async addResidentialInfo(@UserDetails() userDetails: TokenClaims, @Body() residentialInfoData: AddResidentialInfoDto) {
    const userId = userDetails.sub;
    const residentialInfo = await residentialInfoService.addResidentialInfo(userId, residentialInfoData);
    return { residentialInfo };
  }

  @Patch('/')
  public async updateResidentialInfo(@UserDetails() userDetails: TokenClaims, @Body() residentialInfoData: UpdateResidentialInfoDto) {
    const userId = userDetails.sub;
    const residentialInfo = await residentialInfoService.updateResidentialInfo(userId, residentialInfoData);
    return { residentialInfo };
  }
}
