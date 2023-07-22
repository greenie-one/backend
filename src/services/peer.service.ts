import {
  CreateWorkPeerDto,
  CreateWorkPeerResponse,
  GetPeerInformationResponse,
  GetUserWorkPeerResponse,
  GetWorkExDataResponse,
  UpdatePeerWorkVerificationDto,
} from '@/dtos/peer.dto';
import { ErrorCodes, ErrorEnum } from '@/exceptions/errorCodes';
import { HttpException } from '@/exceptions/httpException';
import { DocumentModel } from '@/models/document.model';
import {
  DocumentVerification,
  ExceptHRQuestionFields,
  HRQuestionFields,
  OptionalWorkExFields,
  SkillsVerification,
  WorkPeer,
  WorkPeerModel,
  WorkVerificationBy,
} from '@/models/peer.model';
import { Profile, ProfileModel } from '@/models/profile.model';
import { SkillModel } from '@/models/skills.model';
import { WorkExperience, WorkExperienceModel } from '@/models/workExperience.model';
import { redisClient } from '@/redisClient';
import { otpType } from '@/remote/otp/otp';
import { verification } from '@/remote/peer/verification';
import { checkFields, copyDataFrom, createClassInstanceWithFields } from '@/utils/classes';
import { env } from '@config';
import { FastifyReply } from 'fastify';
import { customAlphabet } from 'nanoid/async';
import { otpService } from './otp.service';

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
    const base_url = `${env('FRONTEND_URL')}/verification/${peer.verificationBy}`;

    const mobileUUID = await customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ', 7)();
    const mobileLink = `${base_url}/${mobileUUID}`;

    const emailUUID = await customAlphabet('0123476789ABCDEFGHIJKLMNOPQRSTUVWXYZ', 7)();
    const emailLink = `${base_url}/${emailUUID}`;

    await redisClient.setEx(mobileUUID, 60 * 60 * 72, JSON.stringify({ peerId: peerId, type: 'mobile' }));
    await redisClient.setEx(emailUUID, 60 * 60 * 72, JSON.stringify({ peerId: peerId, type: 'email' }));

    console.info(`Sending links to ${peer.name} with email ${peer.email} and phone ${peer.phone}`);

    await verification.GetPeerVerification(peer.email, peer.phone, peer.name, `${profile.firstName} ${profile.lastName}`, mobileLink, emailLink);
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

  public async peerSendOTP(peerUUID: string, otp_type: otpType) {
    const { peerId } = await this.peerUUIDtoPeerId(peerUUID);
    const peer = await WorkPeerModel.findById(peerId);
    if (!peer) {
      throw new HttpException(ErrorEnum.PEER_NOT_FOUND);
    }
    const { email, phone } = peer;
    if (otp_type === 'EMAIL') {
      await otpService.sendOTP(email, otp_type);
    } else {
      await otpService.sendOTP(phone, otp_type);
    }
  }

  public async verifyPeerConatct(peerUUID: string, otp_type: otpType, otp: string) {
    const { peerId } = await this.peerUUIDtoPeerId(peerUUID);
    const peer = await WorkPeerModel.findById(peerId);
    if (!peer) {
      throw new HttpException(ErrorEnum.PEER_NOT_FOUND);
    }
    const { email, phone } = peer;
    if (otp_type === 'EMAIL' && (await otpService.verifyOTP(email, otp_type, otp))) {
      peer.emailVerified = true;
      await peer.save();
      return { success: true, message: 'Verified' };
    } else if (otp_type === 'MOBILE' && (await otpService.verifyOTP(phone, otp_type, otp))) {
      peer.phoneVerified = true;
      await peer.save();
      return { success: true, message: 'Verified' };
    } else {
      return { success: false, message: 'Invalid OTP' };
    }
  }

  public async getUserWorkPeers(userId: string) {
    const data = await WorkPeerModel.find({ user: userId });
    const res: GetUserWorkPeerResponse[] = [];
    for (const peer of data) {
      res.push({
        id: peer._id.toString(),
        name: peer.name,
        email: peer.email,
        phone: peer.phone,
        workExperience: peer.ref.toString(),
        isVerificationCompleted: peer.isVerificationCompleted,
      });
    }
    return res;
  }

  public async getPeerInformation(peerUUID: string, reply: FastifyReply) {
    const { peerId, type } = await this.peerUUIDtoPeerId(peerUUID);
    const peer = await WorkPeerModel.findById(peerId);
    if (!peer) {
      throw new HttpException(ErrorEnum.PEER_NOT_FOUND);
    }
    if (peer.isVerificationCompleted) {
      throw new HttpException(ErrorEnum.PEER_ALREADY_VERIFIED);
    }

    if (type === 'mobile' && !peer.phoneVerified) {
      peer.phoneVerified = true;
      await peer.save();
    } else if (type === 'email' && !peer.emailVerified) {
      peer.emailVerified = true;
      await peer.save();
    }

    if (!peer.emailVerified) {
      const err = ErrorCodes[ErrorEnum.PEER_EMAIL_NOT_VERIFIED];
      console.error(err);
      reply.status(err.status).send({ ...ErrorCodes[ErrorEnum.PEER_EMAIL_NOT_VERIFIED], name: peer.name });
    }
    if (!peer.phoneVerified) {
      const err = ErrorCodes[ErrorEnum.PEER_PHONE_NOT_VERIFIED];
      console.error(err);
      reply.status(err.status).send({ ...ErrorCodes[ErrorEnum.PEER_PHONE_NOT_VERIFIED], name: peer.name });
    }

    const workExperience: WorkExperience = await WorkExperienceModel.findById(peer.ref);
    const profile: Profile = await ProfileModel.findOne({ user: peer.user });

    let data: GetWorkExDataResponse = {
      name: profile.firstName + ' ' + profile.lastName,
      profilePic: profile.profilePic,
    };

    if (peer.optionalVerificationFields) {
      data.optionalVerificationFields = {};
      copyDataFrom(
        JSON.parse(JSON.stringify(peer.optionalVerificationFields)),
        JSON.parse(JSON.stringify(workExperience)),
        data.optionalVerificationFields,
      );
    }
    if (peer.verificationBy !== WorkVerificationBy.HR) {
      data.peerPost = peer.verificationBy;
      data.designation = workExperience.designation;
    }

    const skillIds = peer.skills.map((skill) => skill.id);
    const skills = await SkillModel.find({ _id: { $in: skillIds } });
    const documentIds = peer.documents.map((document) => document.id);
    const documents = await DocumentModel.find({ _id: { $in: documentIds } });
    for (const skill of skills) {
      data.skills = [];
      data.skills.push({ id: skill._id.toString(), skillName: skill.skillName, expertise: skill.expertise });
    }
    for (const document of documents) {
      data.documents = [];
      data.documents.push({ id: document._id.toString(), type: document.type, name: document.name, privateUrl: document.privateUrl });
    }

    const res: GetPeerInformationResponse = {
      id: peer._id.toString(),
      name: peer.name,
      email: peer.email,
      phone: peer.phone,
      emailVerified: peer.emailVerified,
      phoneVerified: peer.phoneVerified,
      verificationBy: peer.verificationBy,
      data: data,
      dateOfJoining: workExperience.dateOfJoining.toISOString(),
      dateOfLeaving: workExperience.dateOfLeaving?.toISOString(),
    };
    return res;
  }

  public async createWorkPeer(userId: string, peerData: CreateWorkPeerDto): Promise<CreateWorkPeerResponse> {
    const find = await WorkPeerModel.findOne({ user: userId, email: peerData.email, ref: peerData.ref });
    if (find) {
      throw new HttpException(ErrorEnum.PEER_ALREADY_EXISTS);
    }

    const skillsArr: SkillsVerification[] = [];
    if (peerData.skills.length > 0) {
      const skills = await SkillModel.find({ _id: { $in: peerData.skills } });
      if (skills.length !== peerData.skills.length) {
        throw new HttpException(ErrorEnum.INVALID_VERIFICATION_FIELDS, 'Invalid Skill ids');
      }
      for (const skillId of peerData.skills) {
        skillsArr.push(new SkillsVerification(skillId));
      }
    }

    const documentsArr: DocumentVerification[] = [];
    if (peerData.documents.length > 0) {
      const documents = await DocumentModel.find({ _id: { $in: peerData.documents } });
      if (documents.length !== peerData.documents.length) {
        throw new HttpException(ErrorEnum.INVALID_VERIFICATION_FIELDS, 'Invalid Document ids');
      }
      for (const documentId of peerData.documents) {
        documentsArr.push(new DocumentVerification(documentId));
      }
    }

    let obj: OptionalWorkExFields;
    try {
      obj = createClassInstanceWithFields(peerData.optionalVerificationFields, new OptionalWorkExFields(), OptionalWorkExFields.defaultFields());
      console.info(`created work peer with fields ${JSON.stringify(obj)}`);
      console.info(`created work peer with fields and default questions ${JSON.stringify(obj)}`);
    } catch (e) {
      throw new HttpException(ErrorEnum.INVALID_VERIFICATION_FIELDS, e.message);
    }
    let optionalQuestions;
    if (peerData.verificationBy === WorkVerificationBy.HR) {
      optionalQuestions = HRQuestionFields.defaultFields();
    } else {
      optionalQuestions = ExceptHRQuestionFields.defaultFields();
    }
    const peerDataObj: WorkPeer = {
      ...peerData,
      optionalVerificationFields: obj,
      otherQuestionFields: optionalQuestions,
      skills: skillsArr,
      documents: documentsArr,
      user: userId,
    };
    const peer = await WorkPeerModel.create(peerDataObj);
    await this.sendLinksToPeers(peer._id.toString(), peer);
    return { id: peer._id.toString(), name: peer.name } as CreateWorkPeerResponse;
  }

  public async updatePeerWorkVerification(peerUUID: string, updatedData: UpdatePeerWorkVerificationDto) {
    const { peerId } = await this.peerUUIDtoPeerId(peerUUID);
    const peer = await WorkPeerModel.findById(peerId);
    if (!peer) {
      throw new HttpException(ErrorEnum.PEER_NOT_FOUND);
    }
    if (!peer.emailVerified) {
      throw new HttpException(ErrorEnum.PEER_EMAIL_NOT_VERIFIED);
    } else if (!peer.phoneVerified) {
      throw new HttpException(ErrorEnum.PEER_PHONE_NOT_VERIFIED);
    }
    if (peer.isVerificationCompleted) {
      throw new HttpException(ErrorEnum.PEER_ALREADY_VERIFIED);
    }

    if (updatedData.skills.length > 0) {
      const skillIds = updatedData.skills.map((skill) => skill.id);
      const skills = await SkillModel.find({ _id: { $in: skillIds } });
      if (skills.length !== updatedData.skills.length) {
        throw new HttpException(ErrorEnum.INVALID_VERIFICATION_FIELDS, 'Invalid Skill ids');
      }
      // updatedSkills = JSON.parse(JSON.stringify(updatedData.skills));
      peer.skills = updatedData.skills;
    }

    if (updatedData.documents.length > 0) {
      const documentIds = updatedData.documents.map((document) => document.id);
      const documents = await DocumentModel.find({ _id: { $in: documentIds } });
      if (documents.length !== updatedData.documents.length) {
        throw new HttpException(ErrorEnum.INVALID_VERIFICATION_FIELDS, 'Invalid Document ids');
      }
      peer.documents = updatedData.documents;
    }

    const toObj = peer.toObject().optionalVerificationFields;
    const optionalVerificationKeys = toObj ? Object.keys(toObj) : undefined;
    try {
      if (optionalVerificationKeys) {
        checkFields(optionalVerificationKeys, updatedData.optionalVerificationFields);
      }
      peer.optionalVerificationFields = updatedData.optionalVerificationFields;
    } catch (error) {
      console.error(error);
      throw new HttpException(ErrorEnum.INVALID_VERIFICATION_FIELDS, error.message);
    }
    peer.mandatoryQuestionFields = updatedData.mandatoryQuestions;
    peer.otherQuestionFields = updatedData.otherQuestions;
    peer.mandatoryVerificationFields = updatedData.mandatoryVerificationFields;
    peer.isVerificationCompleted = true;
    peer.save();

    await WorkPeerModel.findByIdAndUpdate(peerId, { $set: { isVerificationCompleted: true } }, { new: true });
    await WorkExperienceModel.findByIdAndUpdate(peer.ref, { $inc: { noOfVerifications: 1 } });
    return { success: true, message: 'Updated Successfully' };
  }

  public async deletePeer(peerid: string) {
    const peer = await WorkPeerModel.findByIdAndDelete(peerid);
    if (!peer) {
      throw new HttpException(ErrorEnum.PEER_NOT_FOUND);
    }
    return { success: true, message: 'Deleted Successfully' };
  }
}

export const peerService = new PeerService();
