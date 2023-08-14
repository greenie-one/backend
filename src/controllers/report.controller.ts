import { reportService } from "@/services/report.service";
import { Controller } from "@/utils/decorators/controller";
import { Get } from "@/utils/decorators/methods";
import { Body } from "@/utils/decorators/request";

@Controller('/report')
export default class reportController {
  @Get('/')
  async createReport(@Body() data: string) {
    return reportService.getAllDetials(data);
  }
}