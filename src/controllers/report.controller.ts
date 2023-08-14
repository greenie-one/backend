import { reportService } from "@/services/report.service";
import { Controller } from "@/utils/decorators/controller";
import { Post } from "@/utils/decorators/methods";
import { Body } from "@/utils/decorators/request";

@Controller('/report')
export default class ReportController {
  @Post('/')
  async createReport(@Body() data: string) {
    return reportService.getAllDetials(data);
  }
}