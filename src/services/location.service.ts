import { ErrorEnum } from '@/exceptions/errorCodes';
import { HttpException } from '@/exceptions/httpException';
import { LocationModel } from '@/models/location.model';

class LocationService {
  public async getCoordinates(userId: string, addresstype: string, address: string) {
    // const coordinates = await function(address) ;
    if (!coordinates) {
      const location = await LocationModel.create({
        user: userId,
        address: address,
        type: addresstype,
        coordinates: coordinates,
      });

      return location;
    } else {
      throw new HttpException(ErrorEnum.INVALID_COORDINATES);
    }
  }
}

export const locationService = new LocationService();
