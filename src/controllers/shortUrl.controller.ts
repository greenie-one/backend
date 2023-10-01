import { Controller } from '@/utils/decorators/controller';
import { Get } from '@/utils/decorators/methods';
import { Params, Reply } from '@/utils/decorators/request';
import { urlService } from '@/services/url.service';
import { FastifyReply } from 'fastify';

@Controller('/sr')
export default class shortUrlController {
  @Get('/:urlId')
  async peerSendOTP(@Params('urlId') urlId: string,  @Reply() reply: FastifyReply) {
    return urlService.redirectUrl(urlId, reply);
  }
}