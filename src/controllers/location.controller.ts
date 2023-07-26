import { GPScompare } from '@/dtos/request/location.dto';
import { locationService } from '@/services/location.service';
import { Controller } from '@/utils/decorators/controller';
import { Post } from '@/utils/decorators/methods';
import { Body } from '@/utils/decorators/request';
import { IPLocation } from '../utils/decorators/location';

@Controller('/location')
export default class LocationController {
  @Post('/compare')
  async compareIPandGPS(@IPLocation() ipLocation: string, @Body() gpsLocation: GPScompare) {
    return locationService.compare(gpsLocation, ipLocation);
  }
}
