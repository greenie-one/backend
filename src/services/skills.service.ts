import { createSkillDto } from '@/dtos/skills.dto';
import { ErrorEnum } from '@/exceptions/errorCodes';
import { HttpException } from '@/exceptions/httpException';
import { SkillModel } from '@/models/skills.model';
import { UserModel } from '@models/users.model';

class SkillService {
  public async createSkill(userId: string, skillData: createSkillDto) {
    try {
      // Check if user exists
      const findUser = await UserModel.findById(userId);
      if (!findUser) {
        throw new HttpException(ErrorEnum.USER_NOT_FOUND);
      }
    } catch (e) {
      throw new HttpException(ErrorEnum.USER_NOT_FOUND);
    }

    const skill = await SkillModel.create({
      designation: skillData.designation,
      user: userId,
      isVerified: skillData.isVerified,
      skillRate: skillData.skillRate,
    });
    return skill;
  }

  public async getSkills(userId: string) {
    const skills = await SkillModel.find({ user: userId });

    if (!skills) {
      throw new HttpException(ErrorEnum.SKILL_NOT_FOUND);
    }
    return skills;
  }

  public async deleteSkill(userId: string, skillId: string) {
    // Check if user exists
    const findUser = await UserModel.findById(userId);
    if (!findUser) {
      throw new HttpException(ErrorEnum.USER_NOT_FOUND);
    }

    // Find the work experience
    const skill = await SkillModel.findById(skillId);
    if (!skill) {
      throw new HttpException(ErrorEnum.SKILL_NOT_FOUND);
    }

    // Check if the work experience belongs to the user
    if (skill.user.toString() !== userId) {
      throw new HttpException(ErrorEnum.SKILL_NOT_FOUND);
    }

    // Delete the work experience
    await skill.deleteOne();

    return { message: ' Skill deleted successfully' };
  }
}

export const skillService = new SkillService();
