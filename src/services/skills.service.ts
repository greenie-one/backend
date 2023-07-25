import { CreateSkillDto, UpdateSkillDto } from '@/dtos/request/skills.dto';
import { AddSkillResponse, SkillResponse } from '@/dtos/response/skills.response';
import { ErrorEnum } from '@/exceptions/errorCodes';
import { HttpException } from '@/exceptions/httpException';
import { SkillModel, Skills } from '@/models/skills.model';
import { UserModel } from '@models/users.model';

class SkillService {
  public async createSkill(userId: string, skillData: CreateSkillDto): Promise<AddSkillResponse> {
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
    } as Skills);
    const res: AddSkillResponse = { success: true, id: skill._id.toString() };
    return res;
  }

  public async getSkills(userId: string): Promise<SkillResponse[]> {
    const skills = await SkillModel.find({ user: userId });

    if (!skills) {
      throw new HttpException(ErrorEnum.SKILL_NOT_FOUND);
    }

    const resp: SkillResponse[] = [];
    for (const skill of skills) {
      resp.push({
        id: skill._id.toString(),
        skillName: skill.skillName,
        workExperience: skill.workExperience?.toString() ?? null,
        expertise: skill.expertise,
      });
    }

    return resp;
  }

  public async deleteSkill(userId: string, skillId: string) {
    const skill = await SkillModel.findById(skillId);
    if (!skill) {
      throw new HttpException(ErrorEnum.SKILL_NOT_FOUND);
    }

    if (skill.user.toString() !== userId) {
      throw new HttpException(ErrorEnum.UNAUTHORIZED);
    }

    await skill.deleteOne();
    return { success: true, message: 'skill deleted successfully' };
  }

  public async updateSkill(userId: string, skillId: string, updatedData: UpdateSkillDto) {

    const skill = await SkillModel.findById(skillId);
    if (!skill) {
      throw new HttpException(ErrorEnum.SKILL_NOT_FOUND);
    }

    if (skill.user.toString() !== userId) {
      throw new HttpException(ErrorEnum.UNAUTHORIZED);
    }

    const updatedSkill = await SkillModel.findByIdAndUpdate(skillId, { $set: updatedData }, { new: true });

    if (!updatedSkill) {
      throw new HttpException(ErrorEnum.SKILL_NOT_FOUND);
    }

    return { success: true, message: 'Updated Successfully' };
  }

  public async getSkillById(userId: string, id: string): Promise<SkillResponse> {
    const skill = await SkillModel.findById(id);

    if (!skill) {
      throw new HttpException(ErrorEnum.SKILL_NOT_FOUND);
    }

    if (skill.user.toString() !== userId) {
      throw new HttpException(ErrorEnum.UNAUTHORIZED);
    }
    const resp: SkillResponse = {
      id: skill._id.toString(),
      skillName: skill.skillName,
      workExperience: skill.workExperience.toString(),
      expertise: skill.expertise,
    };

    return resp;
  }
}

export const skillService = new SkillService();
