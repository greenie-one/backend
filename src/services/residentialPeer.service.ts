import { env } from '@/config';
import { OtpType } from '@/dtos/request/otp.dto';
import { CreateResidentialPeerDto } from '@/dtos/request/residentialPeer.dto';
import { CreateResidentialPeerResponse, GetResidentialPeerResponse, GetUserPeersResponse } from '@/dtos/response/residentialPeer.response';
import { ErrorCodes, ErrorEnum } from '@/exceptions/errorCodes';
import { HttpException } from '@/exceptions/httpException';
import { ProfileModel } from '@/models/profile.model';
import { ResidentialPeer, ResidentialPeerModel } from '@/models/residentialPeer.model';
import { redisClient } from '@/redisClient';
import { verification } from '@/remote/peer/verification';
import { FastifyReply } from 'fastify';
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
    const base_url = `${env('FRONTEND_URL')}/location/verify`;

    const mobileUUID = await customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ', 7)();
    const mobileLink = `${base_url}/${mobileUUID}`;

    const emailUUID = await customAlphabet('0123476789ABCDEFGHIJKLMNOPQRSTUVWXYZ', 7)();
    const emailLink = `${base_url}/${emailUUID}`;

    await redisClient.setEx(mobileUUID, 60 * 60 * 72, JSON.stringify({ peerId: peerId, type: 'mobile' }));
    await redisClient.setEx(emailUUID, 60 * 60 * 72, JSON.stringify({ peerId: peerId, type: 'email' }));

    console.info(`Sending links to ${peer.name} with email ${peer.email} and phone ${peer.phone}`);

    await verification.sendPeerVerificationLinks(
      peer.email,
      peer.phone,
      peer.name,
      `${profile.firstName} ${profile.lastName}`,
      'his residence',
      mobileLink,
      emailLink,
    );
  }

  public async getCopyLink(peerId: string) {
    const uuid = await customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ', 7)();
    await redisClient.setEx(uuid, 60 * 60 * 72, JSON.stringify({ peerId: peerId, type: 'copy' }));
    return `${env('FRONTEND_URL')}/location/verify/${uuid}`;
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

  public async peerSendOTP(peerUUID: string) {
    const { peerId } = await this.peerUUIDtoPeerId(peerUUID);
    const peer = await ResidentialPeerModel.findById(peerId);
    if (!peer) {
      throw new HttpException(ErrorEnum.PEER_NOT_FOUND);
    }
    const { email, phone } = peer;
    if (!peer.emailVerified) {
      await otpService.sendOTP(email, OtpType.EMAIL);
    }
    if (!peer.phoneVerified) {
      await otpService.sendOTP(phone, OtpType.MOBILE);
    }
  }

  public async verifyPeerConatct(peerUUID: string, otp: string, otpType: OtpType) {
    const { peerId } = await this.peerUUIDtoPeerId(peerUUID);
    const peer = await ResidentialPeerModel.findById(peerId);
    if (!peer) {
      throw new HttpException(ErrorEnum.PEER_NOT_FOUND);
    }
    const { email, phone } = peer;
    if (!peer.emailVerified && otpType === OtpType.EMAIL && (await otpService.verifyOTP(email, OtpType.EMAIL, otp))) {
      peer.emailVerified = true;
    } else if (!peer.phoneVerified && otpType === OtpType.MOBILE && (await otpService.verifyOTP(phone, OtpType.MOBILE, otp))) {
      peer.phoneVerified = true;
    } else {
      throw new HttpException(ErrorEnum.INVALID_OTP);
    }
    await peer.save();
    return { success: true, message: 'Contact Verified' };
  }

  public async getPeer(peerUUID: string, reply: FastifyReply): Promise<GetResidentialPeerResponse> {
    const { peerId, type } = await this.peerUUIDtoPeerId(peerUUID);
    const peer = await ResidentialPeerModel.findById(peerId);
    if (!peer) {
      throw new HttpException(ErrorEnum.PEER_NOT_FOUND);
    }
    if (type === 'mobile') {
      peer.phoneVerified = true;
    } else if (type === 'email') {
      peer.emailVerified = true;
    }
    await peer.save();
    if (!peer.emailVerified) {
      const err = ErrorCodes[ErrorEnum.PEER_EMAIL_NOT_VERIFIED];
      console.error(err);
      reply.status(err.status).send({ ...ErrorCodes[ErrorEnum.PEER_EMAIL_NOT_VERIFIED], name: peer.name, phone: peer.phone, email: peer.email });
    }
    if (!peer.phoneVerified) {
      const err = ErrorCodes[ErrorEnum.PEER_PHONE_NOT_VERIFIED];
      console.error(err);
      reply.status(err.status).send({ ...ErrorCodes[ErrorEnum.PEER_PHONE_NOT_VERIFIED], name: peer.name, phone: peer.phone, email: peer.email });
    }

    const profile = await ProfileModel.findOne({ user: peer.user });

    return {
      name: peer.name,
      phone: peer.phone,
      email: peer.email,
      verificationBy: peer.verificationBy,
      user: {
        name: `${profile.firstName} ${profile.lastName}`,
        profilePic: profile.profilePic,
      },
    };
  }

  public async getUserPeers(userId: string): Promise<GetUserPeersResponse[]> {
    const peers = await ResidentialPeerModel.find({ user: userId });
    return peers.map((peer) => {
      return {
        id: peer._id.toString(),
        ref: peer.ref.toString(),
        name: peer.name,
        email: peer.email,
        phone: peer.phone,
        verificationBy: peer.verificationBy,
        isVerificationCompleted: peer.isVerificationCompleted,
        createdAt: peer.createdAt,
        updatedAt: peer.updatedAt,
      };
    });
  }

  public async createPeer(userId: string, peer: CreateResidentialPeerDto): Promise<CreateResidentialPeerResponse> {
    const peerExists = await ResidentialPeerModel.findOne({ ref: peer.ref });
    if (peerExists) {
      throw new HttpException(ErrorEnum.PEER_ALREADY_EXISTS);
    }
    const data: ResidentialPeer = {
      ...peer,
      user: userId,
    };
    const peerModel = await ResidentialPeerModel.create(data);
    await this.sendLinksToPeers(peerModel._id.toString(), peerModel);
    const copyLink = await this.getCopyLink(peerModel._id.toString());
    return { link: copyLink };
  }

  public async deletePeer(userId: string, peerId: string) {
    const peer = await ResidentialPeerModel.findById(peerId);
    if (!peer) {
      throw new HttpException(ErrorEnum.PEER_NOT_FOUND);
    }
    if (peer.user.toString() !== userId) {
      throw new HttpException(ErrorEnum.INVALID_PEER_ID);
    }
    await peer.deleteOne();
    return { success: true, message: 'Peer Deleted' };
  }
}

export const residentialPeerService = new ResidentialPeerService();
