import { reportService } from '@/services/report.service';
import { Controller } from '@/utils/decorators/controller';
import { Get } from '@/utils/decorators/methods';
import { Query } from '@/utils/decorators/request';

@Controller('/report')
export default class ReportController {
  // ADD "@UserDetails(["hr", "admin"]) _: TokenClaims" if role based auth is required
  @Get('')
  async createReport(@Query('email', true) email?: string, @Query('phone', true) phone?: string, @Query('grnID', true) grnID?: string) {
    return reportService.getAllDetails(email, phone, grnID);
  }
}
