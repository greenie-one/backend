import { CreateWorkPeerDto, UpdatePeerWorkVerificationDto } from '@/dtos/peer.dto';
import { ErrorEnum } from '@/exceptions/errorCodes';
import { HttpException } from '@/exceptions/httpException';
import { WorkPeer, WorkPeerModel } from '@/models/peer.model';

class PeerService {
  public async createWorkPeer(userId: string, peerData: CreateWorkPeerDto) {
    const peerDataObj: WorkPeer = {
      ...peerData,
      user: userId,
    };
    const peer = await WorkPeerModel.create(peerDataObj);

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
