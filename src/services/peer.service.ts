import { CreateWorkPeerDto, UpdatePeerWorkVerificationDto } from '@/dtos/peer.dto';
import { ErrorEnum } from '@/exceptions/errorCodes';
import { HttpException } from '@/exceptions/httpException';
import { WorkPeer, WorkPeerModel } from '@/models/peer.model';
import { ProfileModel } from '@/models/profile.model';
import { verification } from '@/remote/peer/verification';

class PeerService {
  public async createWorkPeer(userId: string, peerData: CreateWorkPeerDto) {
    const peerDataObj: WorkPeer = {
      ...peerData,
      user: userId,
    };
    const peer = await WorkPeerModel.create(peerDataObj);
    const profile = await ProfileModel.findOne({ user: peer.user });
    const url = `dev.greenie.one/verification/${peer.verification_by}/${peer._id}`;

    await verification
      .GetPeerVerification(peer.email, peer.phone, peer.name, `${profile.firstName} + ' ' + ${profile.lastName}`, url)
      .catch((err) => {
        console.error(err);
        throw new HttpException(ErrorEnum.Server_ERROR);
      });
    return peer;
  }

  public async UpdatePeerWorkVerification(peerId: string, updatedData: UpdatePeerWorkVerificationDto) {
    const peer = await WorkPeerModel.findById(peerId);
    if (!peer) {
      throw new HttpException(ErrorEnum.PEER_NOT_FOUND);
    }

    const updatedstate = await WorkPeerModel.findByIdAndUpdate(peerId, { $set: updatedData }, { new: true });

    if (!updatedstate) {
      throw new HttpException(ErrorEnum.PEER_NOT_FOUND);
    }

    return { success: true, message: 'Updated Successfully' };
  }
}

export const peerService = new PeerService();
