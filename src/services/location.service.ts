import { GPScompare, GetCoordinatesDto } from '@/dtos/request/location.dto';
import { GetAutocompleteResponse, GetLocationResponse } from '@/dtos/response/location.response';
import { ErrorEnum } from '@/exceptions/errorCodes';
import { HttpException } from '@/exceptions/httpException';
import { Location, LocationModel } from '@/models/location.model';
import { ResidentialInfoModel } from '@/models/residentialInfo.model';
import { ResidentialPeerModel } from '@/models/residentialPeer.model';
import { PlaceResponse } from '@/remote/dtos/autocomplete.response';
import { Geolocation } from '@/remote/location/location';
import { residentialPeerService } from './residentialPeer.service';

export const RADIUS = 6371;

class LocationService {
  public async createLocationFromAddress(userId: string, address: string): Promise<GetLocationResponse> {
    try {
      const placeDetails = await Geolocation.getLocation(address);
      console.log(placeDetails);
      if (!placeDetails) {
        throw new HttpException(ErrorEnum.INVALID_COORDINATES);
      }

      const location = await LocationModel.create({
        user: userId,
        latitude: placeDetails.lat,
        longitude: placeDetails.long,
      } as Location);

      const res: GetLocationResponse = {
        id: location._id.toString(),
        longitude: location.longitude,
        latitude: location.latitude,
        user: location.user.toString(),
        formattedAddress: placeDetails.formattedAddress,
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

      const distance = angluarDistance * RADIUS;

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
    if (residentialInfo.isVerified) {
      throw new HttpException(ErrorEnum.LOCATION_ALREADY_CAPTURED);
    }
    const location = await LocationModel.create({
      user: peer.user,
      latitude: data.latitude,
      longitude: data.longitude,
    });

    peer.isVerificationCompleted = true;
    peer.save();

    residentialInfo.capturedLocation = location._id;
    residentialInfo.isVerified = true;
    residentialInfo.save();
    return { success: true, message: 'Location Captured' };
  }

  public async captureUserLocation(userId: string, residentialId: string, data: GetCoordinatesDto) {
    const residentialInfo = await ResidentialInfoModel.findOne({ user: userId, _id: residentialId });
    if (!residentialInfo) {
      throw new HttpException(ErrorEnum.RESIDENTIAL_INFO_NOT_FOUND);
    }
    if (residentialInfo.isVerified) {
      throw new HttpException(ErrorEnum.LOCATION_ALREADY_CAPTURED);
    }
    const location = await LocationModel.create({
      user: userId,
      latitude: data.latitude,
      longitude: data.longitude,
    });
    residentialInfo.capturedLocation = location._id;
    residentialInfo.isVerified = true;
    residentialInfo.save();
    return residentialInfo;
  }

  public async getAutoCompleteResults(partialAdress: string): Promise<GetAutocompleteResponse> {
    const resp = await Geolocation.autocomplete(partialAdress);
    return resp;
  }

  public async getPlaceDetails(placeId: string): Promise<PlaceResponse> {
    try {
      const resp = await Geolocation.getPlaceDetails(placeId);
      return resp;
    } catch (e) {
      throw new HttpException(ErrorEnum.PLACE_DETAILS_ERROR);
    }
  }
}

export const locationService = new LocationService();