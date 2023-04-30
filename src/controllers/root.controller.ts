import { Controller } from '@/utils/decorators/controller';
import { Get } from '@/utils/decorators/methods';
import { Query } from '@/utils/decorators/request';

@Controller()
export default class RootController {
  @Get('/health-check')
  public getUsers() {
    return 'success';
  }

  @Get('/linkedIn')
  public testLinkedIn(@Query() query: unknown) {
    console.log(query);
  }
}
