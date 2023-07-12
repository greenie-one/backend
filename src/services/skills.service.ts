import { AddSkillResponse, GetSkillResponse, createSkillDto } from '@/dtos/skills.dto';
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
    return { success: true, skillId: skill._id.toString() };
  }

  public async getSkills(userId: string): Promise<GetSkillResponse> {
    const skills = await SkillModel.find({ user: userId });

    if (!skills) {
      throw new HttpException(ErrorEnum.SKILL_NOT_FOUND);
    }

    const skillArry = [];
    for (const skill of skills) {
      const skillObj = {
        skillId: skill._id.toString(),
        skillName: skill.skillName,
        workExperience: skill.workExperience,
        expertise: skill.expertise,
      };
      skillArry.push(skillObj);
    }
    return { skills: skillArry };
  }
}

export const skillService = new SkillService();
