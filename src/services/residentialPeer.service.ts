import { env } from '@/config';
import { OtpType } from '@/dtos/request/workExPeer.dto';
import { SendPeerOtpResponse, VerifyPeerResponse } from '@/dtos/response/residentialPeer.response';
import { ErrorEnum } from '@/exceptions/errorCodes';
import { HttpException } from '@/exceptions/httpException';
import { ProfileModel } from '@/models/profile.model';
import { ResidentialPeer, ResidentialPeerModel } from '@/models/residentialPeer.model';
import { redisClient } from '@/redisClient';
import { verification } from '@/remote/peer/verification';
import { customAlphabet } from 'nanoid/async';
import { otpService } from './otp.service';

class ResidentialPeerService {
  public async peerUUIDtoPeerId(uuid: string) {
    const data = await redisClient.get(uuid);
    if (!data) {
      throw new HttpException(ErrorEnum.INVALID_PEER_UUID);
    }
    const { peerId, type }: { peerId: string; type: string } = JSON.parse(data);
    return { peerId, type };
  }

  public async sendLinksToPeers(peerId: string, peer: ResidentialPeer) {
    const profile = await ProfileModel.findOne({ user: peer.user });
    const base_url = `${env('FRONTEND_URL')}/location/${peer.verificationBy}`;

    const mobileUUID = await customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ', 7)();
    const mobileLink = `${base_url}/${mobileUUID}`;

    const emailUUID = await customAlphabet('0123476789ABCDEFGHIJKLMNOPQRSTUVWXYZ', 7)();
    const emailLink = `${base_url}/${emailUUID}`;

    await redisClient.setEx(mobileUUID, 60 * 60 * 72, JSON.stringify({ peerId: peerId, type: 'mobile' }));
    await redisClient.setEx(emailUUID, 60 * 60 * 72, JSON.stringify({ peerId: peerId, type: 'email' }));

    console.info(`Sending links to ${peer.name} with email ${peer.email} and phone ${peer.phone}`);

    await verification.sendPeerVerificationLinks(peer.email, peer.phone, peer.name, `${profile.firstName} ${profile.lastName}`, 'his residence', mobileLink, emailLink);
  }

  public async resendLinksToPeers(userId: string, peerId: string) {
    const peer = await ResidentialPeerModel.findById(peerId);
    if (!peer) {
      throw new HttpException(ErrorEnum.PEER_NOT_FOUND);
    }
    if (peer.user.toString() !== userId) {
      throw new HttpException(ErrorEnum.INVALID_PEER_ID);
    }
    await this.sendLinksToPeers(peerId, peer);
    return { success: true, message: 'Link Sent' };
  }

  public async peerSendOTP(peerUUID: string): Promise<SendPeerOtpResponse> {
    const { peerId } = await this.peerUUIDtoPeerId(peerUUID);
    const peer = await ResidentialPeerModel.findById(peerId);
    if (!peer) {
      throw new HttpException(ErrorEnum.PEER_NOT_FOUND);
    }
    const { email, phone } = peer;
    if (!peer.emailVerified) {
      await otpService.sendOTP(email, OtpType.EMAIL);
    } else {
      await otpService.sendOTP(phone, OtpType.MOBILE);
    }

    return {}
  }

  public async verifyPeerContact(peerUUID: string, otp: string): Promise<VerifyPeerResponse> {
    const { peerId } = await this.peerUUIDtoPeerId(peerUUID);
    const peer = await ResidentialPeerModel.findById(peerId);
    if (!peer) {
      throw new HttpException(ErrorEnum.PEER_NOT_FOUND);
    }
    const { email, phone } = peer;

    peer.emailVerified = !!email;
    peer.phoneVerified = !!phone;

    const contact = peer.emailVerified ? email : phone;
    const otpType = peer.emailVerified ? OtpType.EMAIL : OtpType.MOBILE

    if (await otpService.verifyOTP(contact, otpType, otp)) {
      await peer.save();
      return {};
    } else {
      throw new HttpException(ErrorEnum.INVALID_OTP);
    }
  }
}

export const residentialPeerService = new ResidentialPeerService();
