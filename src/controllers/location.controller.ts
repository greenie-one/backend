import { TokenClaims } from '@/dtos/request/auth.dto';
import { GetCoordinatesDto } from '@/dtos/request/location.dto';
import { locationService } from '@/services/location.service';
import { UserDetails } from '@/utils/decorators/auth';
import { Controller } from '@/utils/decorators/controller';
import { Get, Post } from '@/utils/decorators/methods';
import { Body, Params, Query } from '@/utils/decorators/request';

@Controller('/location')
export default class LocationController {
  @Post('/capture/me/:residentialId')
  public async captureLocationSelf(
    @UserDetails() userDetails: TokenClaims,
    @Params('residentialId') residentialId: string,
    @Body() data: GetCoordinatesDto,
  ) {
    const userId = userDetails.sub;
    return locationService.captureUserLocation(userId, residentialId, data);
  }

  @Post('/capture/peer/:peerUUID')
  public async captureLocationPeer(@Params('peerUUID') peerUUID: string, @Body() data: GetCoordinatesDto) {
    return locationService.capturePeerLocation(peerUUID, data);
  }

  @Get('/autocomplete')
  public async autoCompleteLocation(@UserDetails() _: TokenClaims, @Query('address') partialAddress: string) {
    return locationService.getAutoCompleteResults(partialAddress);
  }

  @Get('/place')
  public async  getPlaceDeatils(@UserDetails() _:TokenClaims, @Query('placeId') placeId: string){
    return locationService.getPlaceDetails(placeId);
  }
}
