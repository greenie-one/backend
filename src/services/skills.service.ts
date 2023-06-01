import { createSkillDto, updateSkillDto } from '@/dtos/skills.dto';
import { ErrorEnum } from '@/exceptions/errorCodes';
import { HttpException } from '@/exceptions/httpException';
import { SkillModel } from '@/models/skills.model';
import { UserModel } from '@models/users.model';

class SkillService {
  public async createSkill(userId: string, skillData: createSkillDto) {
    try {
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
    const skill = await SkillModel.findById(skillId);
    if (!skill) {
      throw new HttpException(ErrorEnum.UNAUTHORIZED);
    }

    if (skill.user.toString() !== userId) {
      throw new HttpException(ErrorEnum.UNAUTHORIZED);
    }

    await skill.deleteOne();

    return { message: ' Skill deleted successfully' };
  }
  public async updateSkill(userId: string, skillId: string, updatedData: updateSkillDto) {
    const skill = await SkillModel.findById(skillId);
    if (!skill) {
      throw new HttpException(ErrorEnum.UNAUTHORIZED);
    }

    if (skill.user.toString() !== userId) {
      throw new HttpException(ErrorEnum.UNAUTHORIZED);
    }

    const updatedSkill = await SkillModel.findByIdAndUpdate(skillId, { $set: updatedData }, { new: true });

    if (!updatedSkill) {
      throw new HttpException(ErrorEnum.UNAUTHORIZED);
    }

    return updatedSkill;
  }
}

export const skillService = new SkillService();
