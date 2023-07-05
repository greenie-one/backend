import { ErrorEnum } from '@/exceptions/errorCodes';
import { HttpException } from '@/exceptions/httpException';
import { LocationModel } from '@/models/location.model';
import { Geolocation } from '@/remote/location/location';
import { GPScompare } from '../dtos/location.dto';

class LocationService {
  public async getCoordinates(userId: string, addresstype: string, address: string) {
    const coordinates = await Geolocation.getLocation(address).catch((err) => {
      console.log(err);
      console.log(coordinates);
      throw new HttpException(ErrorEnum.INVALID_COORDINATES);
    });
    if (coordinates && coordinates.code != 'RM003') {
      const location = await LocationModel.create({
        user: userId,
        address: address,
        type: addresstype,
        coordinates: coordinates,
      });

      return location;
    } else {
      console.log(coordinates);
      throw new HttpException(ErrorEnum.INVALID_COORDINATES);
    }
  }

  public async compare(gpsLocation: GPScompare, IPlocation: string) {
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
