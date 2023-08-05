import { CreateSkillDto, UpdateSkillDto } from '@/dtos/request/skills.dto';
import { CreateSkillResponse, DeleteSkillResponse, GetSkillsResponse, SkillResponse, UpdateSkillResponse } from '@/dtos/response/skills.response';
import { ErrorEnum } from '@/exceptions/errorCodes';
import { HttpException } from '@/exceptions/httpException';
import { SkillModel } from '@/models/skills.model';

class SkillService {
  public async createSkill(userId: string, skillData: CreateSkillDto): Promise<CreateSkillResponse> {
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
    const skills = await SkillModel.find({ user: userId }) ?? [];

    return skills.map((skill) => ({
      id: skill._id.toString(),
      skillName: skill.skillName,
      workExperience: skill.workExperience?.toString() ?? null,
      expertise: skill.expertise,
    }));
  }

  public async deleteSkill(userId: string, skillId: string): Promise<DeleteSkillResponse> {
    const skill = await SkillModel.findById(skillId);
    if (!skill) {
      throw new HttpException(ErrorEnum.SKILL_NOT_FOUND);
    }

    if (skill.user.toString() !== userId) {
      throw new HttpException(ErrorEnum.UNAUTHORIZED);
    }

    await skill.deleteOne();
    return {};
  }

  public async updateSkill(userId: string, skillId: string, updatedData: UpdateSkillDto): Promise<UpdateSkillResponse> {
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

    return {
      id: updatedSkill._id.toString(),
      skillName: updatedSkill.skillName,
      workExperience: updatedSkill.workExperience?.toString() ?? null,
      expertise: updatedSkill.expertise,
    };
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
