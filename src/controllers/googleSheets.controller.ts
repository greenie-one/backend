import { TokenClaims } from '@/dtos/request/auth.dto';
import { addUserInfoDTO } from '@/dtos/request/googleSheets.dto';
import { googleSheetsService } from '@/services/googleSheets.service';
import { UserDetails } from '@/utils/decorators/auth';
import { Controller } from '@/utils/decorators/controller';
import { Post } from '@/utils/decorators/methods';
import { Body } from '@/utils/decorators/request';

@Controller('/googleSheets')
export default class GoogleSheetsController {
  @Post('/addData')
  async addData(@UserDetails(["hr"]) userDetails: TokenClaims, @Body() data: addUserInfoDTO) {
    return googleSheetsService.addData(userDetails.email, data);
  }
}