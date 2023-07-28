import { TokenClaims } from '@/dtos/request/auth.dto';
import { CreateResidentialInfoDto, UpdateResidentialInfoDto } from '@/dtos/request/residentialInfo.dto';
import { CreateResidentialInfoResponse, DeleteResidentialInfoResponse, GetResidentialInfoResponse, UpdateResidentialInfoResponse } from '@/dtos/response/residentialInfo.response';
import { residentialInfoService } from '@/services/residentialInfo.service';
import { UserDetails } from '@/utils/decorators/auth';
import { Controller } from '@/utils/decorators/controller';
import { Delete, Get, Patch, Post } from '@/utils/decorators/methods';
import { Body, Params } from '@/utils/decorators/request';

@Controller('/residential_info')
export default class ResidentialInfoController {
  @Get('/me')
  public async getUserResidentialInfo(@UserDetails() userDetails: TokenClaims): Promise<GetResidentialInfoResponse> {
    return residentialInfoService.getUserResidentialInfo(userDetails.sub);
  }

  @Post('/')
  public async createResidentialInfo(
    @UserDetails() userDetails: TokenClaims,
    @Body() residentialInfoData: CreateResidentialInfoDto,
  ): Promise<CreateResidentialInfoResponse> {
    return residentialInfoService.createResidentialInfo(userDetails.sub, residentialInfoData);
  }

  @Delete('/:id')
  public async deleteResidentialInfo(@UserDetails() userDetails: TokenClaims, @Params('id') id: string): Promise<DeleteResidentialInfoResponse> {
    return residentialInfoService.deleteResidentialInfo(userDetails.sub, id);
  }

  @Patch('/:id')
  public async updateResidentialInfo(
    @UserDetails() userDetails: TokenClaims,
    @Params('id') residentialInfoId: string,
    @Body() data: UpdateResidentialInfoDto,
  ): Promise<UpdateResidentialInfoResponse> {
    return residentialInfoService.updateResidentialInfo(userDetails.sub, residentialInfoId, data);
  }
}
