import { CreatePeerDto, UpdatePeerDto } from '@/dtos/peer.dto';
import { ErrorEnum } from '@/exceptions/errorCodes';
import { HttpException } from '@/exceptions/httpException';
import { PeerModel } from '@/models/peer.model';

class PeerService {
  public async createPeer(peerData: CreatePeerDto) {
    const peer = await PeerModel.create({
      peerFor: peerData.peerFor,
      peerForRef: peerData.peerForRef,
      name: peerData.name,
      email: peerData.email,
      phone: peerData.phone,
      verification_by: peerData.verification_by,
      verification_fields: peerData.verification_fields,
    });

    return peer;
  }

  public async UpdatePeer(peerId: string, updatedData: UpdatePeerDto) {
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

  // public async getPeerVerification(userId: string, peerId: string): Promise<PeerVerificationResponse> {
  //   const peer = await PeerModel.findById(peerId);

  //   if (!peer) {
  //     throw new HttpException(ErrorEnum.PEER_NOT_FOUND);
  //   }

  //   const skills = await PeerVerificationSkillsModel.find({ peer: peerId });
  //   const skillWithDetails = [];
  //   if (skills) {
  //     for (const skill of skills) {
  //       const skillFromModel = await SkillModel.findById(skill.skill);

  //       if (skillFromModel) {
  //         const dets = {
  //           skillName: skillFromModel.skillName,
  //           expertise: skillFromModel.expertise,
  //           state: skill.state,
  //         };

  //         skillWithDetails.push(dets);
  //       }
  //     }
  //   }
  //   const documents = await PeerVerificationDocumentsModel.find({ peer: peerId });
  //   const documentWithDetails = [];
  //   if (documents) {
  //     for (const document of documents) {
  //       const docFromModel = await DocumentModel.findById(document.document);

  //       if (docFromModel) {
  //         const public_url = await SAStokenService.getSASTokenPeer(document.document, docFromModel.private_url);
  //         const dets = {
  //           documentName: docFromModel.name,
  //           documentType: docFromModel.type,
  //           public_url: public_url,
  //           state: document.state,
  //         };

  //         documentWithDetails.push(dets);
  //       }
  //     }
  //   }

  //   const userDetails = await PeerVerificationModel.findOne({ peer: peerId });
  //   const work_exp = await WorkExperienceModel.findById(peer.workExperience);

  //   if (!work_exp) {
  //     throw new HttpException(ErrorEnum.WORKEXPERIENCE_NOT_FOUND);
  //   }

  //   const userDetailsObj = {
  //     candidateId: { state: userDetails.candidateId, value: work_exp.companyId },
  //     department: { state: userDetails.department, value: work_exp.department },
  //     designation: { state: userDetails.designation, value: work_exp.designation },
  //     dateOfJoining: { state: userDetails.dateOfJoining, value: work_exp.companyStartDate.toString() },
  //     dateOfLeaving: { state: userDetails.department, value: work_exp.companyEndDate.toString() },
  //   };
  //   const response = {
  //     peerDetails: { name: peer.name, email: peer.email, phone: peer.phone, peerType: peer.peerType, workExperience: work_exp._id.toString() },
  //     peerVerificationStatus: userDetailsObj,
  //     peerDocumentStatus: documentWithDetails,
  //   };

  //   return response;
  // }
}

export const peerService = new PeerService();
