import { OtpType } from '@/dtos/request/otp.dto';
import { CreateWorkPeerDto, UpdatePeerWorkVerificationDto, WorkVerificationBy } from '@/dtos/request/workExPeer.dto';
import {
  CreateWorkPeerResponse,
  GetPeerInformationResponse,
  GetPeerWorkExDataResponse,
  GetUserWorkPeerResponse,
} from '@/dtos/response/workExPeer.response';
import { ErrorCodes, ErrorEnum } from '@/exceptions/errorCodes';
import { HttpException } from '@/exceptions/httpException';
import { DocumentModel } from '@/models/document.model';
import { Profile, ProfileModel } from '@/models/profile.model';
import { SkillModel } from '@/models/skills.model';
import { DocumentVerification, HRQuestions, SelectedFields, SkillsVerification, Status, WorkPeer, WorkPeerModel } from '@/models/workExPeer.model';
import { WorkExperienceModel } from '@/models/workExperience.model';
import { redisClient } from '@/redisClient';
import { verification } from '@/remote/peer/verification';
import { checkFields, copyDataFrom, createClassInstanceWithFields } from '@/utils/classes';
import { env } from '@config';
import { FastifyReply } from 'fastify';
import { customAlphabet } from 'nanoid/async';
import { SAStokenService } from './blobStorage.service';
import { otpService } from './otp.service';

class WorkExPeerService {
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

    const companyName = (await WorkExperienceModel.findById(peer.ref).select('companyName'))?.companyName
    if (!companyName) {
      throw new HttpException(ErrorEnum.WORKEXPERIENCE_NOT_FOUND)
    }

    await verification.sendPeerVerificationLinks(peer.email, peer.phone, peer.name, `${profile.firstName} ${profile.lastName}`, companyName, mobileLink, emailLink);
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

  public async peerSendOTP(peerUUID: string) {
    const { peerId } = await this.peerUUIDtoPeerId(peerUUID);
    const peer = await WorkPeerModel.findById(peerId);
    if (!peer) {
      throw new HttpException(ErrorEnum.PEER_NOT_FOUND);
    }

    const { email, phone } = peer;
    if (!peer.emailVerified) {
      await otpService.sendOTP(email, OtpType.EMAIL);
    } else {
      await otpService.sendOTP(phone, OtpType.MOBILE);
    }
  }

  public async verifyPeerContact(peerUUID: string, otp: string) {
    const { peerId } = await this.peerUUIDtoPeerId(peerUUID);
    const peer = await WorkPeerModel.findById(peerId);
    if (!peer) {
      throw new HttpException(ErrorEnum.PEER_NOT_FOUND);
    }
    const { email, phone } = peer;
    if (!peer.emailVerified && (await otpService.verifyOTP(email, OtpType.EMAIL, otp))) {
      peer.emailVerified = true;
      await peer.save();
      return { success: true, message: 'Verified' };
    } else if (!peer.phoneVerified && (await otpService.verifyOTP(phone, OtpType.MOBILE, otp))) {
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
        peerPost: peer.verificationBy,
        createdAt: peer.createdAt.toISOString(),
        updatedAt: peer.updatedAt.toISOString(),
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
      companyName: workExperience.companyName,
      peerPost: peer.verificationBy,
      designation: workExperience.designation,
      skills: [],
      documents: [],
    };

    if (peer.selectedFields) {
      data.selectedFields = {};
      copyDataFrom(peer.toObject().selectedFields, workExperience.toObject(), data.selectedFields);
    }

    const skillIds = peer.skills.map((skill) => skill.id);
    await Promise.all(
      (await SkillModel.find({ _id: { $in: skillIds } })).map((skill) => {
        data.skills.push({ id: skill._id.toString(), skillName: skill.skillName, expertise: skill.expertise });
      }),
    );

    const documentIds = peer.documents.map((document) => document.id);
    await Promise.all(
      (await DocumentModel.find({ _id: { $in: documentIds } })).map(async (document) => {
        const sasToken = await SAStokenService.getSASTokenUser(document.user.toString());
        data.documents.push({
          id: document._id.toString(),
          type: document.type,
          name: document.name,
          privateUrl: `${document.privateUrl}?${sasToken}`,
        });
      }),
    );

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

    const workExperience = await WorkExperienceModel.findById(peerData.ref);

    let obj: SelectedFields;
    try {
      checkFields(peerData.selectedFields, workExperience.toObject());
      obj = createClassInstanceWithFields(peerData.selectedFields, new SelectedFields(), SelectedFields.defaultFields());
    } catch (e) {
      throw new HttpException(ErrorEnum.INVALID_VERIFICATION_FIELDS, e.message);
    }

    // Type specific fields
    let otherQuestions: HRQuestions;
    if (peerData.verificationBy === WorkVerificationBy.HR) {
      otherQuestions = HRQuestions.defaultFields();
      obj.salary = Status.defaultStatus();
    }

    const peerDataObj: WorkPeer = {
      ...peerData,
      selectedFields: obj,
      otherQuestions: otherQuestions,
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

    if (peer.verificationBy === WorkVerificationBy.HR && !peer.otherQuestions) {
      throw new HttpException(ErrorEnum.INVALID_VERIFICATION_FIELDS, 'Invalid HR Questions, cannot be null or undefined');
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

    const toObj = peer.toObject().selectedFields;
    const selectedFieldKeys = toObj ? Object.keys(toObj) : undefined;
    try {
      if (selectedFieldKeys) {
        checkFields(selectedFieldKeys, updatedData.selectedFields);
      }
      peer.selectedFields = updatedData.selectedFields;
    } catch (error) {
      console.error(error);
      throw new HttpException(ErrorEnum.INVALID_VERIFICATION_FIELDS, error.message);
    }
    peer.allQuestions = updatedData.allQuestions;
    peer.otherQuestions = updatedData.otherQuestions;
    peer.isVerificationCompleted = true;
    peer.save();

    await WorkPeerModel.findByIdAndUpdate(peerId, { $set: { isVerificationCompleted: true } }, { new: true });
    await WorkExperienceModel.findByIdAndUpdate(peer.ref, { $inc: { noOfVerifications: 1 } });
    return { success: true, message: 'Updated Successfully' };
  }

  public async deletePeer(userId: string, peerid: string) {
    const peer = await WorkPeerModel.findOne({ _id: peerid, user: userId });
    if (!peer) {
      throw new HttpException(ErrorEnum.PEER_NOT_FOUND);
    }
    if (peer.isVerificationCompleted) {
      throw new HttpException(ErrorEnum.PEER_ALREADY_VERIFIED);
    }
    await WorkPeerModel.findByIdAndDelete(peerid);
    return { success: true, message: 'Deleted Successfully' };
  }
}

export const workPeerService = new WorkExPeerService();
