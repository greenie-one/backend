import { GPScompareDto } from '@/dtos/request/location.dto';
import { GetLocationResponse } from '@/dtos/response/location.response';
import { ErrorEnum } from '@/exceptions/errorCodes';
import { HttpException } from '@/exceptions/httpException';
import { LocationModel } from '@/models/location.model';
import { Geolocation } from '@/remote/location/location';

class LocationService {
  public async createLocation(userId: string, address: string): Promise<GetLocationResponse> {
    const coordinates = await Geolocation.getLocation(address).catch((err) => {
      console.log(err);
      console.log(coordinates);
      throw new HttpException(ErrorEnum.INVALID_COORDINATES);
    });
    if (coordinates && coordinates.code != 'RM003') {
      const location = await LocationModel.create({
        user: userId,
        coordinates: coordinates,
      });

      const res: GetLocationResponse = {
        id: location._id.toString(),
        coordinates: location.coordinates.toString(),
        user: location.user.toString(),
      };
      return res;
    } else {
      console.log(coordinates);
      throw new HttpException(ErrorEnum.INVALID_COORDINATES);
    }
  }

  public async compare(gpsLocation: GPScompareDto, IPlocation: string) {
    try {
      const ipLocation = IPlocation.split(',');
      const ipLat = (parseFloat(ipLocation[0]) * Math.PI) / 180;
      const ipLog = (parseFloat(ipLocation[1]) * Math.PI) / 180;

      const gpsLocationSplit = gpsLocation.GPS.split(',');
      const gpsLat = (parseFloat(gpsLocationSplit[0]) * Math.PI) / 180;
      const gpsLog = (parseFloat(gpsLocationSplit[1]) * Math.PI) / 180;

      const deltaLong = gpsLog - ipLog;
      const deltaLat = gpsLat - ipLat;
      const sinD = Math.pow(Math.sin(deltaLat / 2), 2) + Math.cos(ipLat) * Math.cos(gpsLat) * Math.pow(Math.sin(deltaLong / 2), 2);
      const angluarDistance = 2 * Math.asin(Math.sqrt(sinD));

      const distance = angluarDistance * radius;

      const response = distance < 30 ? true : false;

      return { response, distance };
    } catch (err) {
      throw new HttpException(ErrorEnum.INVALID_COORDINATES);
    }
  }
}

export const radius = 6371;

export const locationService = new LocationService();

