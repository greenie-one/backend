import { AadharCard } from '@/models/aadhar.model';
import { AadharService } from '@/services/aadhar.service';
import { Controller } from '@/utils/decorators/controller';
import { Get } from '@/utils/decorators/methods';
import { FastifyReply, FastifyRequest } from 'fastify';

@Controller('/aadhar')
export default class AadharController {
  public aadharService: AadharService = new AadharService();

  @Get('/:user_id')
  public async getAadhar(req: FastifyRequest<{ Params: { user_id: string } }>, res: FastifyReply) {
    const user_id: string = req.params.user_id;
    const aadhar: AadharCard = await this.aadharService.findAadharByUser(user_id);
    res.status(200).send({ data: aadhar, message: 'findOne' });
  }

  // @Post('/:user_id')
  // public async createAadhar(req: FastifyRequest<{ Params: { user_id: string } }>, res: FastifyReply) {
  //   const user_id: string = req.params.user_id;
  //   // Initialize the ZOOP API flow, store temp data to user session
  // }
}
