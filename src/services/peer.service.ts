import { CreateWorkPeerDto, UpdatePeerWorkVerificationDto } from '@/dtos/peer.dto';
import { ErrorEnum } from '@/exceptions/errorCodes';
import { HttpException } from '@/exceptions/httpException';
import { WorkPeer, WorkPeerModel } from '@/models/peer.model';
import { ProfileModel } from '@/models/profile.model';
import { redisClient } from '@/redisClient';
import { verification } from '@/remote/peer/verification';
import { env } from '@config';
import { randomUUID } from 'crypto';

class PeerService {
  public async peerUUIDtoPeerId(uuid: string) {
    const data = await redisClient.get(uuid);
    if (!data) {
      throw new HttpException(ErrorEnum.INVALID_PEER_UUID);
    }
    const { peerId, type }: { peerId: string; type: string } = JSON.parse(data);
    return { peerId, type };
  }

  public async sendLinksToPeers(peerId: string, peer: WorkPeer) {
    const profile = await ProfileModel.findOne({ user: peer.user });
    const base_url = `${env('REMOTE_BASE_URL')}/verification/${peer.verificationBy}/`;

    const mobileUUID = randomUUID().toString();
    const mobileLink = `${base_url}/${mobileUUID}`;

    const emailUUID = randomUUID().toString();
    const emailLink = `${base_url}/${emailUUID}`;

    await redisClient.setEx(mobileUUID, 60 * 60 * 72, JSON.stringify({ peerId: peerId, type: 'mobile' }));
    await redisClient.setEx(emailUUID, 60 * 60 * 72, JSON.stringify({ peerId: peerId, type: 'email' }));

    await verification
      .GetPeerVerification(peer.email, peer.phone, peer.name, `${profile.firstName} + ' ' + ${profile.lastName}`, mobileLink, emailLink)
      .catch((err) => {
        console.error(err);
        throw new HttpException(ErrorEnum.Server_ERROR);
      });
    return { success: true, message: 'Link Sent' };
  }

  public async createWorkPeer(userId: string, peerData: CreateWorkPeerDto) {
    const peerDataObj: WorkPeer = {
      ...peerData,
      user: userId,
    };
    const peer = await WorkPeerModel.create(peerDataObj);
    await this.sendLinksToPeers(peer._id.toString(), peer);
    return peer;
  }

  public async resendLinksToPeers(userId: string, peerId: string) {
    const peer = await WorkPeerModel.findById(peerId);
    if (!peer) {
      throw new HttpException(ErrorEnum.PEER_NOT_FOUND);
    }
    if (peer.user.toString() !== userId) {
      throw new HttpException(ErrorEnum.INVALID_PEER_ID);
    }
    await this.sendLinksToPeers(peerId, peer);
    return { success: true, message: 'Link Sent' };
  }

  public async getPeerInformation(peer_uuid: string) {
    const { peerId, type } = await this.peerUUIDtoPeerId(peer_uuid);
    const peer = await WorkPeerModel.findById(peerId);
    if (!peer) {
      throw new HttpException(ErrorEnum.PEER_NOT_FOUND);
    }

    if (type === 'mobile' && !peer.phoneVerified) {
      peer.phoneVerified = true;
      await peer.save();
    } else if (type === 'email' && !peer.emailVerified) {
      peer.emailVerified = true;
      await peer.save();
    }

    return peer;
  }

  public async UpdatePeerWorkVerification(peerId: string, updatedData: UpdatePeerWorkVerificationDto) {
    const peer = await WorkPeerModel.findById(peerId);
    if (!peer.emailVerified || !peer.phoneVerified) {
      throw new HttpException(ErrorEnum.PEER_NOT_VERIFIED);
    }

    const updatedstate = await WorkPeerModel.findByIdAndUpdate(peerId, { $set: updatedData }, { new: true });

    if (!updatedstate) {
      throw new HttpException(ErrorEnum.PEER_NOT_FOUND);
    }

    return { success: true, message: 'Updated Successfully' };
  }
}

export const peerService = new PeerService();
