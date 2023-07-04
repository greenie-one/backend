import { CreatePeerDto } from '@/dtos/peer.dto';
import { ErrorEnum } from '@/exceptions/errorCodes';
import { HttpException } from '@/exceptions/httpException';
import { DocumentModel } from '@/models/document.model';
import { PeerModel } from '@/models/peer.model';
import { PeerVerificationDocumentsModel, PeerVerificationModel, PeerVerificationSkillsModel } from '@/models/peerVerification.model';
import { SkillModel } from '@/models/skills.model';
import { UserModel } from '@models/users.model';

class PeerService {
  public async createPeer(userId: string, peerData: CreatePeerDto) {
    try {
      const findUser = await UserModel.findById(userId);
      if (!findUser) {
        throw new HttpException(ErrorEnum.USER_NOT_FOUND);
      }
    } catch (e) {
      throw new HttpException(ErrorEnum.USER_NOT_FOUND);
    }

    const peer = await PeerModel.create({
      name: peerData.name,
      email: peerData.email,
      phone: peerData.phone,
      workExperience: peerData.workExperience,
      peerType: peerData.peerType,
    });

    const skills = await SkillModel.find({ workExperience: peer.workExperience });
    if (skills) {
      for (const skill of skills) {
        await PeerVerificationSkillsModel.create({
          peer: peer._id,
          skill: skill._id,
        });
      }
    }

    const documents = await DocumentModel.find({ workExperience: peer.workExperience });
    if (documents) {
      for (const document of documents) {
        await PeerVerificationDocumentsModel.create({
          peer: peer._id,
          document: document._id,
        });
      }
    }

    await PeerVerificationModel.create({
      peer: peer._id,
    });

    return peer;
  }

  public async getPeerVerification(userId: string, peerId: string) {
    const peer = await PeerModel.findById({ peerId });

    if (!peer) {
      throw new HttpException(ErrorEnum.PEER_NOT_FOUND);
    }

    const peerSkillStatus = await PeerVerificationSkillsModel.findById({ peerId });
    const peerDocumentStatus = await PeerVerificationDocumentsModel.findById({ peerId });
    const peerVerificationStatus = await PeerVerificationModel.findById({ peerId });

    return { peer, peerSkillStatus, peerDocumentStatus, peerVerificationStatus };
  }
}

export const peerService = new PeerService();
