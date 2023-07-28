import { TokenClaims } from '@/dtos/request/auth.dto';
import { CreateSkillDto, UpdateSkillDto } from '@/dtos/request/skills.dto';
import { CreateSkillResponse, GetSkillsResponse } from '@/dtos/response/skills.response';
import { skillService } from '@/services/skills.service';
import { UserDetails } from '@/utils/decorators/auth';
import { Controller } from '@/utils/decorators/controller';
import { Delete, Get, Patch, Post } from '@/utils/decorators/methods';
import { Body, Params } from '@/utils/decorators/request';

@Controller('/skill')
export default class skillController {
  @Post('/create')
  async createSkill(@UserDetails() userDetails: TokenClaims, @Body() data: CreateSkillDto): Promise<CreateSkillResponse> {
    return skillService.createSkill(userDetails.sub, data);
  }

  @Get('/get')
  async getSkill(@UserDetails() userDetails: TokenClaims): Promise<GetSkillsResponse> {
    return skillService.getSkills(userDetails.sub);
  }

  @Delete('/:id')
  async deleteSkill(@UserDetails() userDetails: TokenClaims, @Params('id') id: string) {
    return skillService.deleteSkill(userDetails.sub, id);
  }

  @Patch('/:id')
  async updateSkill(
    @UserDetails() userDetails: TokenClaims,
    @Params('id') id: string,
    @Body() data: UpdateSkillDto,
  ) {
    return skillService.updateSkill(userDetails.sub, id, data);
  }

  @Get('/:id')
  async getSkillById(@UserDetails() userDetails: TokenClaims, @Params('id') skillId: string) {
    return skillService.getSkillById(userDetails.sub, skillId);
  }
}
