import { reportService } from '@/services/report.service';
import { Controller } from '@/utils/decorators/controller';
import { Get } from '@/utils/decorators/methods';
import { Query } from '@/utils/decorators/request';

@Controller('/report')
export default class ReportController {
  @Get('')
  async createReport(@Query('email', true) email?: string, @Query('phone', true) phone?: string) {
    return reportService.getAllDetails(email, phone);
  }
}
