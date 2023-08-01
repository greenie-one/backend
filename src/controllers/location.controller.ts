import { TokenClaims } from '@/dtos/request/auth.dto';
import { GetCoordinatesDto } from '@/dtos/request/location.dto';
import { CapturePeerLocationResponse, CaptureUserLocationResponse } from '@/dtos/response/location.response';
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
  ): Promise<CaptureUserLocationResponse> {
    const userId = userDetails.sub;
    return locationService.captureUserLocation(userId, residentialId, data);
  }

  @Post('/capture/peer/:peerUUID')
  public async captureLocationPeer(@Params('peerUUID') peerUUID: string, @Body() data: GetCoordinatesDto): Promise<CapturePeerLocationResponse> {
    return locationService.capturePeerLocation(peerUUID, data);
  }

  @Get('/autocomplete')
  public async autoCompleteLocation(@UserDetails() _: TokenClaims, @Query('address') term: string) {
    return locationService.getAutoCompleteResults(term);
  }
}
