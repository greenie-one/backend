import { Controller } from '@/utils/decorators/controller';
import { Get } from '@/utils/decorators/methods';

@Controller()
export default class RootController {
  @Get('/health-check')
  public getUsers() {
    return 'success';
  }
}
