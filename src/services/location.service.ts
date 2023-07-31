import { GPScompare, GetCoordinatesDto } from '@/dtos/request/location.dto';
import { GetAutocompleteResponse, GetLocationResponse } from '@/dtos/response/location.response';
import { ErrorEnum } from '@/exceptions/errorCodes';
import { HttpException } from '@/exceptions/httpException';
import { Location, LocationModel } from '@/models/location.model';
import { ResidentialInfoModel } from '@/models/residentialInfo.model';
import { ResidentialPeerModel } from '@/models/residentialPeer.model';
import { Geolocation } from '@/remote/location/location';
import { createAddressString } from '@/utils/location';
import { residentialPeerService } from './residentialPeer.service';

class LocationService {
  public async createLocation(userId: string, address: string): Promise<GetLocationResponse> {
    try {
      const coordinates = await Geolocation.getLocation(address);
      console.log(coordinates);
      if (!coordinates) {
        throw new HttpException(ErrorEnum.INVALID_COORDINATES);
      }

      const location = await LocationModel.create({
        user: userId,
        latitude: coordinates.lat,
        longitude: coordinates.long,
      } as Location);

      const res: GetLocationResponse = {
        id: location._id.toString(),
        longitude: location.longitude,
        latitude: location.latitude,
        user: location.user.toString(),
      };
      return res;
    } catch (e) {
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

  public async capturePeerLocation(peerUUID: string, data: GetCoordinatesDto) {
    const { peerId } = await residentialPeerService.peerUUIDtoPeerId(peerUUID);
    const peer = await ResidentialPeerModel.findById(peerId);
    if (!peer) {
      throw new HttpException(ErrorEnum.PEER_NOT_FOUND);
    }
    const residentialInfo = await ResidentialInfoModel.findById(peer.ref);
    if (!residentialInfo) {
      throw new HttpException(ErrorEnum.RESIDENTIAL_INFO_NOT_FOUND);
    }
    if (residentialInfo.capturedLocation) {
      throw new HttpException(ErrorEnum.LOCATION_ALREADY_CAPTURED);
    }
    const location = await LocationModel.create({
      user: peer.user,
      latitude: data.latitude,
      longitude: data.longitude,
    });
    residentialInfo.capturedLocation = location._id;
    residentialInfo.verified = true;
    residentialInfo.save();
    return { success: true, message: 'Location Captured' };
  }

  public async captureUserLocation(userId: string, data: GetCoordinatesDto) {
    const residentialInfo = await ResidentialInfoModel.findOne({ user: userId });
    if (!residentialInfo) {
      throw new HttpException(ErrorEnum.RESIDENTIAL_INFO_NOT_FOUND);
    }
    if (residentialInfo.capturedLocation) {
      throw new HttpException(ErrorEnum.LOCATION_ALREADY_CAPTURED);
    }
    const location = await LocationModel.create({
      user: userId,
      latitude: data.latitude,
      longitude: data.longitude,
    });
    residentialInfo.capturedLocation = location._id;
    residentialInfo.verified = true;
    residentialInfo.save();
    return residentialInfo;
  }

  async getAutoCompleteResults(term: string): Promise<GetAutocompleteResponse> {
    const resp = await Geolocation.autocomplete(term)
    return resp.results.map(({ id, score, address, position }) => ({
      id: id,
      score: score,
      address: {
        address_line_1: createAddressString(address.streetNumber, address.municipalitySubdivision),
        address_line_2: createAddressString(address.streetName, address.municipality),
        city: address.countrySecondarySubdivision,
        state: address.countrySubdivision,
        country: address.country,
        street: address.streetNumber,
        pincode: address.postalCode,
        type: 'permanent'
      },
      addressString: address.freeformAddress,
      position: {
        latitude: position.lat,
        longitude: position.lon
      }
    }))
  }
}

export const radius = 6371;

export const locationService = new LocationService();
