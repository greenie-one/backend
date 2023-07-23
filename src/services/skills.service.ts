import { CreateSkillDto } from '@/dtos/request/skills.dto';
import { CreateSkillResponse, GetSkillsResponse } from '@/dtos/response/skills.response';
import { ErrorEnum } from '@/exceptions/errorCodes';
import { HttpException } from '@/exceptions/httpException';
import { SkillModel } from '@/models/skills.model';
import { UserModel } from '@models/users.model';

class SkillService {
  public async createSkill(userId: string, skillData: CreateSkillDto): Promise<CreateSkillResponse> {
    try {
      const findUser = await UserModel.findById(userId);
      if (!findUser) {
        throw new HttpException(ErrorEnum.USER_NOT_FOUND);
      }
    } catch (e) {
      throw new HttpException(ErrorEnum.USER_NOT_FOUND);
    }

    const skill = await SkillModel.create({
      user: userId,
      ...skillData,
    });

    return {
      id: skill._id.toString(),
      expertise: skill.expertise,
      skillName: skill.skillName,
      workExperience: skill.workExperience?.toString(),
    };
  }

  public async getSkills(userId: string): Promise<GetSkillsResponse> {
    const skills = await SkillModel.find({ user: userId });

    if (!skills) {
      throw new HttpException(ErrorEnum.SKILL_NOT_FOUND);
    }

    return skills.map((skill) => ({
      id: skill._id.toString(),
      skillName: skill.skillName,
      workExperience: skill.workExperience?.toString() ?? null,
      expertise: skill.expertise,
    }));
  }
}

export const skillService = new SkillService();
