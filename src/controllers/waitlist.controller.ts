import { AddToWaitlistDto } from '@/dtos/waitlist.dto';
import { Controller } from '@/utils/decorators/controller';
import { Post } from '@/utils/decorators/methods';
import { HttpException } from '@exceptions/httpException';
import { WaitlistService } from '@services/waitlist.service';
import { FastifyReply, FastifyRequest } from 'fastify';

@Controller('/waitlist')
export default class WaitlistController {
  public waitlistService: WaitlistService = new WaitlistService();

  @Post('/')
  public async addToWaitlist(req: FastifyRequest<{ Body: AddToWaitlistDto }>, res: FastifyReply) {
    const waitlistData: AddToWaitlistDto = req.body;
    try {
      const waitlist = await this.waitlistService.addEmailToWaitlist(waitlistData);
      res.status(201).send({ data: waitlist, message: 'added to waitlist' });
    } catch (error) {
      if (error instanceof HttpException) {
        res.status(error.status).send({ message: error.message });
      } else {
        res.status(500).send({ message: 'Internal server error' });
      }
    }
  }
}
