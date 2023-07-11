import { CreatePeerDto, PeerVerificationResponse, UpdateDocumentVerificationDto, UpdateSkillVerificationDto } from '@/dtos/peer.dto';
import { ErrorEnum } from '@/exceptions/errorCodes';
import { HttpException } from '@/exceptions/httpException';
import { DocumentModel } from '@/models/document.model';
import { PeerModel } from '@/models/peer.model';
import { PeerVerificationDocumentsModel, PeerVerificationModel, PeerVerificationSkillsModel } from '@/models/peerVerification.model';
import { SkillModel } from '@/models/skills.model';
import { WorkExperienceModel } from '@/models/workExperience.model';
import { UserModel } from '@models/users.model';
import { SAStokenService } from './blobStorage.service';

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
      workExperience: peerData.workExperience, //to which the user want to get the verification
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

  public async getPeerVerification(userId: string, peerId: string): Promise<PeerVerificationResponse> {
    const peer = await PeerModel.findById(peerId);

    if (!peer) {
      throw new HttpException(ErrorEnum.PEER_NOT_FOUND);
    }

    const skills = await PeerVerificationSkillsModel.find({ peer: peerId });
    const skillWithDetails = [];
    if (skills) {
      for (const skill of skills) {
        const skillFromModel = await SkillModel.findById(skill.skill);

        if (skillFromModel) {
          const dets = {
            skillName: skillFromModel.skillName,
            expertise: skillFromModel.expertise,
            state: skill.state,
          };

          skillWithDetails.push(dets);
        }
      }
    }
    const documents = await PeerVerificationDocumentsModel.find({ peer: peerId });
    const documentWithDetails = [];
    if (documents) {
      for (const document of documents) {
        const docFromModel = await DocumentModel.findById(document.document);

        if (docFromModel) {
          const public_url = await SAStokenService.getSASTokenPeer(document.document, docFromModel.private_url);
          const dets = {
            documentName: docFromModel.name,
            documentType: docFromModel.type,
            public_url: public_url,
            state: document.state,
          };

          documentWithDetails.push(dets);
        }
      }
    }

    const userDetails = await PeerVerificationModel.findOne({ peer: peerId });
    const work_exp = await WorkExperienceModel.findById(peer.workExperience);

    if (!work_exp) {
      throw new HttpException(ErrorEnum.WORKEXPERIENCE_NOT_FOUND);
    }

    const userDetailsObj = {
      candidateId: { state: userDetails.candidateId, value: work_exp.companyId },
      department: { state: userDetails.department, value: work_exp.department },
      designation: { state: userDetails.designation, value: work_exp.designation },
      dateOfJoining: { state: userDetails.dateOfJoining, value: work_exp.companyStartDate.toString() },
      dateOfLeaving: { state: userDetails.department, value: work_exp.companyEndDate.toString() },
    };
    const response = {
      peerDetails: { name: peer.name, email: peer.email, phone: peer.phone, peerType: peer.peerType, workExperience: work_exp._id.toString() },
      peerVerificationStatus: userDetailsObj,
      peerDocumentStatus: documentWithDetails,
    };

    return response;
  }

  public async updateSkillVerification(userId: string, peerId: string, skillId: string, updatedData: UpdateSkillVerificationDto) {
    const skill = await PeerVerificationSkillsModel.findOne({ peer: peerId, skill: skillId });
    if (!skill) {
      throw new HttpException(ErrorEnum.PEER_NOT_FOUND);
    }

    const updatedState = await PeerVerificationSkillsModel.findByIdAndUpdate(skill._id, { $set: updatedData }, { new: true });

    if (!updatedState) {
      throw new HttpException(ErrorEnum.PEER_NOT_FOUND);
    }

    return updatedState;
  }

  public async updateDocumentVerification(userId: string, peerId: string, documentId: string, updatedData: UpdateDocumentVerificationDto) {
    const document = await PeerVerificationDocumentsModel.findOne({ peer: peerId, document: documentId });
    if (!document) {
      throw new HttpException(ErrorEnum.PEER_NOT_FOUND);
    }

    const updatedState = await PeerVerificationDocumentsModel.findByIdAndUpdate(document._id, { $set: updatedData }, { new: true });

    if (!updatedState) {
      throw new HttpException(ErrorEnum.PEER_NOT_FOUND);
    }

    return updatedState;
  }
}

export const peerService = new PeerService();
