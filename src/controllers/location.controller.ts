import { TokenClaims } from '@/dtos/request/auth.dto';
import { GetGpsCoordinatesDto } from '@/dtos/request/residentialInfo.dto';
import { residentialInfoService } from '@/services/residentialInfo.service';
import { residentialPeerService } from '@/services/residentialPeer.service';
import { UserDetails } from '@/utils/decorators/auth';
import { Controller } from '@/utils/decorators/controller';
import { Post } from '@/utils/decorators/methods';
import { Body, Params } from '@/utils/decorators/request';

@Controller('/location')
export default class LocationController {
  @Post('/capture/me')
  public async captureLocationSelf(@UserDetails() userDetails: TokenClaims, @Body() data: GetGpsCoordinatesDto) {
    const userId = userDetails.sub;
    return residentialInfoService.captureUserLocation(userId, data);
  }

  @Post('/capture/peer/:peerUUID')
  public async captureLocationPeer(@Params('peerUUID') peerUUID: string, @Body() data: GetGpsCoordinatesDto) {
    return residentialPeerService.capturePeerLocation(peerUUID, data);
  }
}
