import { TokenClaims } from '@/dtos/request/auth.dto';
import { GetCoordinatesDto } from '@/dtos/request/location.dto';
import { locationService } from '@/services/location.service';
import { UserDetails } from '@/utils/decorators/auth';
import { Controller } from '@/utils/decorators/controller';
import { Post } from '@/utils/decorators/methods';
import { Body, Params } from '@/utils/decorators/request';

@Controller('/location')
export default class LocationController {
  @Post('/capture/me')
  public async captureLocationSelf(@UserDetails() userDetails: TokenClaims, @Body() data: GetCoordinatesDto) {
    const userId = userDetails.sub;
    return locationService.captureUserLocation(userId, data);
  }

  @Post('/capture/peer/:peerUUID')
  public async captureLocationPeer(@Params('peerUUID') peerUUID: string, @Body() data: GetCoordinatesDto) {
    return locationService.capturePeerLocation(peerUUID, data);
  }
}
