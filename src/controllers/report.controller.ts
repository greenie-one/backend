import { TokenClaims } from '@/dtos/request/auth.dto';
import { reportService } from '@/services/report.service';
import { UserDetails } from '@/utils/decorators/auth';
import { Controller } from '@/utils/decorators/controller';
import { Get } from '@/utils/decorators/methods';
import { Query } from '@/utils/decorators/request';

@Controller('/report')
export default class reportController {
  @Get('')
  async createReport(@UserDetails() _: TokenClaims, @Query('email') email: string) {
    return reportService.getAllDetials(email);
  }
}
