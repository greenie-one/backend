import { OtpType } from '@/dtos/request/otp.dto';
import { CreateWorkPeerDto, UpdatePeerWorkVerificationDto, WorkVerificationBy } from '@/dtos/request/peer.dto';
import {
  CreateWorkPeerResponse,
  DeleteWorkPeerResponse,
  GetPeerInformationResponse,
  GetPeerWorkExDataResponse,
  GetUserWorkPeersResponse,
  ResendPeerLinkResponse,
  UpdateWorkPeerResponse,
  WorkPeerSendOtpResponse,
  WorkPeerVerifyResponse,
} from '@/dtos/response/peer.response';
import { ErrorCodes, ErrorEnum } from '@/exceptions/errorCodes';
import { HttpException } from '@/exceptions/httpException';
import { DocumentModel } from '@/models/document.model';
import {
  DocumentVerification,
  ExceptHRQuestionFields,
  HRQuestionFields,
  OptionalWorkExperienceFields,
  SkillsVerification,
  WorkPeer,
  WorkPeerModel,
} from '@/models/peer.model';
import { Profile, ProfileModel } from '@/models/profile.model';
import { SkillModel } from '@/models/skills.model';
import { WorkExperienceModel } from '@/models/workExperience.model';
import { redisClient } from '@/redisClient';
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

  public async resendLinksToPeers(userId: string, peerId: string): Promise<ResendPeerLinkResponse> {
    const peer = await WorkPeerModel.findById(peerId);
    if (!peer) {
      throw new HttpException(ErrorEnum.PEER_NOT_FOUND);
    }
    if (peer.user.toString() !== userId) {
      throw new HttpException(ErrorEnum.INVALID_PEER_ID);
    }
    await this.sendLinksToPeers(peerId, peer);
    return {};
  }

  public async peerSendOTP(peerUUID: string, otp_type: OtpType): Promise<WorkPeerSendOtpResponse> {
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

    return {};
  }

  public async verifyPeerConatct(peerUUID: string, otp_type: OtpType, otp: string): Promise<WorkPeerVerifyResponse> {
    const { peerId } = await this.peerUUIDtoPeerId(peerUUID);
    const peer = await WorkPeerModel.findById(peerId);
    if (!peer) {
      throw new HttpException(ErrorEnum.PEER_NOT_FOUND);
    }
    const { email, phone } = peer;

    peer.emailVerified = otp_type === OtpType.EMAIL;
    peer.phoneVerified = otp_type === OtpType.MOBILE;

    const contact = otp_type === OtpType.EMAIL ? email : phone;

    if (await otpService.verifyOTP(contact, otp_type, otp)) {
      await peer.save();
      return {};
    } else {
      throw new HttpException(ErrorEnum.INVALID_OTP);
    }
  }

  public async getUserWorkPeers(userId: string): Promise<GetUserWorkPeersResponse> {
    const data = await WorkPeerModel.find({ user: userId });
    return data.map((peer) => ({
      id: peer._id.toString(),
      name: peer.name,
      email: peer.email,
      phone: peer.phone,
      workExperience: peer.ref.toString(),
      isVerificationCompleted: peer.isVerificationCompleted,
      createdAt: peer.createdAt.toISOString(),
      updatedAt: peer.updatedAt.toISOString(),
    }));
  }

  public async getPeerInformation(peerUUID: string, reply: FastifyReply): Promise<GetPeerInformationResponse> {
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
      reply.status(err.status).send({ ...ErrorCodes[ErrorEnum.PEER_EMAIL_NOT_VERIFIED], name: peer.name, phone: peer.phone, email: peer.email });
    }
    if (!peer.phoneVerified) {
      const err = ErrorCodes[ErrorEnum.PEER_PHONE_NOT_VERIFIED];
      console.error(err);
      reply.status(err.status).send({ ...ErrorCodes[ErrorEnum.PEER_PHONE_NOT_VERIFIED], name: peer.name, phone: peer.phone, email: peer.email });
    }

    const workExperience = await WorkExperienceModel.findById(peer.ref);
    const profile: Profile = await ProfileModel.findOne({ user: peer.user });

    const data: GetPeerWorkExDataResponse = {
      name: `${profile.firstName} ${profile.lastName}`,
      profilePic: profile.profilePic,
    };

    if (peer.optionalVerificationFields) {
      data.optionalVerificationFields = {};
      copyDataFrom(peer.toObject().optionalVerificationFields, workExperience.toObject(), data.optionalVerificationFields);
    }
    if (peer.verificationBy !== WorkVerificationBy.HR) {
      data.peerPost = peer.verificationBy;
      data.designation = workExperience.designation;
      data.companyName = workExperience.companyName;
    }

    const skillIds = peer.skills.map((skill) => skill.id);
    const skills = await SkillModel.find({ _id: { $in: skillIds } });
    const documentIds = peer.documents.map((document) => document.id);
    const documents = await DocumentModel.find({ _id: { $in: documentIds } });
    for (const skill of skills) {
      data.skills = [];
      data.skills.push({ id: skill._id.toString(), skillName: skill.skillName, expertise: skill.expertise });
    }

    data.documents = documents.map((document) => ({
      id: document._id.toString(),
      name: document.name,
      type: document.type,
      user: document.user.toString(),
      createdAt: document.createdAt,
      updatedAt: document.updatedAt,
      privateUrl: document.privateUrl,
    }));

    return {
      id: peer._id.toString(),
      name: peer.name,
      email: peer.email,
      phone: peer.phone,
      emailVerified: peer.emailVerified,
      phoneVerified: peer.phoneVerified,
      verificationBy: peer.verificationBy,
      data: data,
      dateOfJoining: workExperience.dateOfJoining,
      dateOfLeaving: workExperience.dateOfLeaving,
    };
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

    let obj: OptionalWorkExperienceFields;
    try {
      obj = createClassInstanceWithFields(
        peerData.optionalVerificationFields,
        new OptionalWorkExperienceFields(),
        OptionalWorkExperienceFields.defaultFields(),
      );
    } catch (e) {
      throw new HttpException(ErrorEnum.INVALID_VERIFICATION_FIELDS, e.message);
    }
    let optionalQuestions: HRQuestionFields | ExceptHRQuestionFields;
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

  public async updatePeerWorkVerification(peerUUID: string, updatedData: UpdatePeerWorkVerificationDto): Promise<UpdateWorkPeerResponse> {
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

    const updatedWorkPeer = await WorkPeerModel.findByIdAndUpdate(peerId, { $set: { isVerificationCompleted: true } }, { new: true });
    await WorkExperienceModel.findByIdAndUpdate(peer.ref, { $inc: { noOfVerifications: 1 } });
    return { id: updatedWorkPeer?._id?.toString(), name: updatedWorkPeer.name };
  }

  public async deletePeer(userId: string, peerid: string): Promise<DeleteWorkPeerResponse> {
    const peer = await WorkPeerModel.findOne({ _id: peerid, user: userId });
    if (!peer) {
      throw new HttpException(ErrorEnum.PEER_NOT_FOUND);
    }
    if (peer.isVerificationCompleted) {
      throw new HttpException(ErrorEnum.PEER_ALREADY_VERIFIED);
    }
    await WorkPeerModel.findByIdAndDelete(peerid);
    return {};
  }
}

export const peerService = new PeerService();
