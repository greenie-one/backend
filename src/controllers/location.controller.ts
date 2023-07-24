import { GPScompare } from '@/dtos/request/location.dto';
import { Controller } from '@/utils/decorators/controller';
import { Post } from '@/utils/decorators/methods';
import { Body, Params } from '@/utils/decorators/request';
import { IPLocation } from '../utils/decorators/location';

@Controller('/location')
export default class LocationController {
  @Post('/verifyLcoation/:id')
  public async verifyLocation(@Body() body: GPScompare, @Params('id') residentialInfoId: string, @IPLocation() IPlocation: string) {
    // return await locationService.compare(body, IPlocation);
    return;
  }
}
