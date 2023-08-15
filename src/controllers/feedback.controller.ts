import { TokenClaims } from '@/dtos/request/auth.dto';
import { AddFeedbackDto } from '@/dtos/request/feedback.dto';
import { feedbackService } from '@/services/feedback.service';
import { UserDetails } from '@/utils/decorators/auth';
import { Controller } from '@/utils/decorators/controller';
import { Get, Post } from '@/utils/decorators/methods';
import { Body, Params } from '@/utils/decorators/request';
import { FeedbackType } from "@/dtos/request/feedback.dto";

@Controller('/feedback')
export default class FeedbackController {
  @Post('/add')
  public async addFeedback( @UserDetails() user: TokenClaims, @Body() body: AddFeedbackDto) {
    return await feedbackService.addFeedback(user.sub, body);
  }

  @Get('/:type')
  public async getFeedbacks(@UserDetails() user: TokenClaims, @Params('type') type: FeedbackType) {
    return await feedbackService.getFeedbacks(user.sub, type);
  }
}