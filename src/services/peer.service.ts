import { CreatePeerDto, UpdatePeerWorkVerificationDto } from '@/dtos/peer.dto';
import { ErrorEnum } from '@/exceptions/errorCodes';
import { HttpException } from '@/exceptions/httpException';
import { PeerModel } from '@/models/peer.model';

class PeerService {
  public async createPeer(peerData: CreatePeerDto) {
    const peer = await PeerModel.create(peerData);

    return peer;
  }

  public async UpdatePeerWorkVerification(peerId: string, updatedData: UpdatePeerWorkVerificationDto) {
    const peer = await PeerModel.findById(peerId);
    if (!peer) {
      throw new HttpException(ErrorEnum.PEER_NOT_FOUND);
    }

    const updatedstate = await PeerModel.findByIdAndUpdate(peerId, { $set: updatedData }, { new: true });

    if (!updatedstate) {
      throw new HttpException(ErrorEnum.PEER_NOT_FOUND);
    }

    return { success: true, message: 'Updated Successfully' };
  }
}

export const peerService = new PeerService();
