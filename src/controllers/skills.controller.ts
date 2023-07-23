import { TokenClaims } from '@/dtos/request/auth.dto';
import { CreateSkillDto } from '@/dtos/request/skills.dto';
import { CreateSkillResponse, GetSkillsResponse } from '@/dtos/response/skills.response';
import { skillService } from '@/services/skills.service';
import { UserDetails } from '@/utils/decorators/auth';
import { Controller } from '@/utils/decorators/controller';
import { Get, Post } from '@/utils/decorators/methods';
import { Body } from '@/utils/decorators/request';

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
}
