import { AddSkillResponse, GetSkillsResponse, createSkillDto } from '@/dtos/skills.dto';
import { ErrorEnum } from '@/exceptions/errorCodes';
import { HttpException } from '@/exceptions/httpException';
import { SkillModel } from '@/models/skills.model';
import { UserModel } from '@models/users.model';

class SkillService {
  public async createSkill(userId: string, skillData: createSkillDto): Promise<AddSkillResponse> {
    try {
      const findUser = await UserModel.findById(userId);
      if (!findUser) {
        throw new HttpException(ErrorEnum.USER_NOT_FOUND);
      }
    } catch (e) {
      throw new HttpException(ErrorEnum.USER_NOT_FOUND);
    }

    const skill = await SkillModel.create({
      skillName: skillData.skillName,
      user: userId,
      workExperience: skillData.workExperience,
      expertise: skillData.expertise,
    });
    const res: AddSkillResponse = { success: true, id: skill._id.toString() };
    return res;
  }

  public async getSkills(userId: string): Promise<GetSkillsResponse> {
    const skills = await SkillModel.find({ user: userId });

    if (!skills) {
      throw new HttpException(ErrorEnum.SKILL_NOT_FOUND);
    }

    const resp: GetSkillsResponse = {
      skills: [],
    };
    for (const skill of skills) {
      resp.skills.push({
        id: skill._id.toString(),
        skillName: skill.skillName,
        workExperience: skill.workExperience.toString(),
        expertise: skill.expertise,
      });
    }
    return resp;
  }
}

export const skillService = new SkillService();
