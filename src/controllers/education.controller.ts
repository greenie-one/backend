import { CreateEducationHistoryDto, UpdateEducationHistoryDto } from '@/dtos/education.dto';
import { Controller } from '@/utils/decorators/controller';
import { Delete, Get, Patch, Post } from '@/utils/decorators/methods';
import { ValidateDto } from '@/utils/validation';
import { EducationHistoryService } from '@services/education.service';
import { FastifyReply, FastifyRequest } from 'fastify';

@Controller('/education')
export default class EducationHistoryController {
  public educationHistoryService: EducationHistoryService = new EducationHistoryService();

  @Get('/:userId')
  public async getEducationHistory(req: FastifyRequest<{ Params: { userId: string } }>, res: FastifyReply) {
    const userId = req.params.userId;
    const educationHistory = await this.educationHistoryService.findEducationHistoryById(userId);
    res.status(200).send({ data: educationHistory, message: 'findOne' });
  }

  @ValidateDto(CreateEducationHistoryDto, 'body')
  @Post('/:userId')
  public async createEducationHistory(req: FastifyRequest<{ Body: CreateEducationHistoryDto; Params: { userId: string } }>, res: FastifyReply) {
    const userId = req.params.userId;
    const educationHistoryData = req.body;
    const createdEducationHistory = await this.educationHistoryService.createEducationHistory(userId, educationHistoryData);
    res.status(201).send({ data: createdEducationHistory, message: 'created' });
  }

  @ValidateDto(UpdateEducationHistoryDto, 'body')
  @Patch('/:eduId')
  public async updateEducationHistory(req: FastifyRequest<{ Body: UpdateEducationHistoryDto; Params: { eduId: string } }>, res: FastifyReply) {
    const eduId = req.params.eduId;
    const educationHistoryData = req.body;
    const updatedEducationHistory = await this.educationHistoryService.updateEducationHistory(eduId, educationHistoryData);
    res.status(200).send({ data: updatedEducationHistory, message: 'updated' });
  }

  @Delete('/:eduId')
  public async deleteEducationHistory(req: FastifyRequest<{ Params: { eduId: string } }>, res: FastifyReply) {
    const eduId = req.params.eduId;
    await this.educationHistoryService.deleteEducationHistory(eduId);
    res.status(204).send();
  }
}
