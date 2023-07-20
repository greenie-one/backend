import {
  CreateWorkPeerDto,
  CreateWorkPeerResponse,
  GetPeerInformationResponse,
  GetUserWorkPeerResponse,
  GetWorkExDataResponse,
  UpdatePeerWorkVerificationDto,
} from '@/dtos/peer.dto';
import { ErrorEnum } from '@/exceptions/errorCodes';
import { HttpException } from '@/exceptions/httpException';
import { ExceptHRQuestionFields, HRQuestionFields, OptionalWorkExFields, WorkPeer, WorkPeerModel, WorkVerificationBy } from '@/models/peer.model';
import { Profile, ProfileModel } from '@/models/profile.model';
import { WorkExperience, WorkExperienceModel } from '@/models/workExperience.model';
import { redisClient } from '@/redisClient';
import { otpType } from '@/remote/otp/otp';
import { verification } from '@/remote/peer/verification';
import { copyDataFromInstance, copyFieldsFromInstance, createClassInstanceWithFields } from '@/utils/classes';
import { env } from '@config';
import { randomUUID } from 'crypto';
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

    const mobileUUID = randomUUID().toString();
    const mobileLink = `${base_url}/${mobileUUID}`;

    const emailUUID = randomUUID().toString();
    const emailLink = `${base_url}/${emailUUID}`;

    await redisClient.setEx(mobileUUID, 60 * 60 * 72, JSON.stringify({ peerId: peerId, type: 'mobile' }));
    await redisClient.setEx(emailUUID, 60 * 60 * 72, JSON.stringify({ peerId: peerId, type: 'email' }));

    console.info(`Sending links to ${peer.name} with email ${peer.email} and phone ${peer.phone}`);

    await verification.GetPeerVerification(peer.email, peer.phone, peer.name, `${profile.firstName} ${profile.lastName}`, mobileLink, emailLink);
  }

  private getQuestionsBasedOnType(type: WorkVerificationBy) {
    if (type === WorkVerificationBy.HR) {
      return HRQuestionFields.defaultFields();
    } else {
      return ExceptHRQuestionFields.defaultFields();
    }
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
      });
    }
    return res;
  }

  public async getPeerInformation(peerUUID: string) {
    const { peerId, type } = await this.peerUUIDtoPeerId(peerUUID);
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

    if (!peer.emailVerified) {
      throw new HttpException(ErrorEnum.PEER_EMAIL_NOT_VERIFIED);
    }
    if (!peer.phoneVerified) {
      throw new HttpException(ErrorEnum.PEER_PHONE_NOT_VERIFIED);
    }

    const workExperience: WorkExperience = await WorkExperienceModel.findById(peer.ref);
    const profile: Profile = await ProfileModel.findOne({ user: peer.user });

    const data: GetWorkExDataResponse = {
      name: profile.firstName + ' ' + profile.lastName,
      profilePic: profile.profilePic,
    };

    const fieldsData = copyDataFromInstance(
      JSON.parse(JSON.stringify(peer.optionalVerificationFields)),
      JSON.parse(JSON.stringify(workExperience)),
      data,
    );
    fieldsData.dateOfJoining = workExperience.dateOfJoining.toISOString();
    fieldsData.dateOfLeaving = workExperience.dateOfLeaving.toISOString();

    const res: GetPeerInformationResponse = {
      id: peer._id.toString(),
      name: peer.name,
      email: peer.email,
      phone: peer.phone,
      emailVerified: peer.emailVerified,
      phoneVerified: peer.phoneVerified,
      verificationBy: peer.verificationBy,
      optionalVerificationFields: peer.optionalVerificationFields,
      mandatoryVerificationFields: peer.mandatoryVerificationFields,
      mandatoryQuestionFields: peer.mandatoryQuestionFields,
      otherQuestionFields: peer.otherQuestionFields,
      data: fieldsData,
    };

    return res;
  }

  public async createWorkPeer(userId: string, peerData: CreateWorkPeerDto): Promise<CreateWorkPeerResponse> {
    const find = await WorkPeerModel.findOne({ user: userId, email: peerData.email });
    if (find) {
      throw new HttpException(ErrorEnum.PEER_ALREADY_EXISTS);
    }
    let obj: OptionalWorkExFields;
    try {
      obj = createClassInstanceWithFields(peerData.optionalVerificationFields, new OptionalWorkExFields(), OptionalWorkExFields.defaultFields());
      console.info(`created work peer with fields ${JSON.stringify(obj)}`);
      console.info(`created work peer with fields and default questions ${JSON.stringify(obj)}`);
    } catch (e) {
      throw new HttpException(ErrorEnum.INVALID_VERIFICATION_FIELDS, e.message);
    }
    const optionalQuestions = this.getQuestionsBasedOnType(peerData.verificationBy);
    const peerDataObj: WorkPeer = {
      ...peerData,
      optionalVerificationFields: obj,
      otherQuestionFields: optionalQuestions,
      user: userId,
    };
    const peer = await WorkPeerModel.create(peerDataObj);
    await this.sendLinksToPeers(peer._id.toString(), peer);
    return { id: peer._id.toString(), name: peer.name } as CreateWorkPeerResponse;
  }

  public async UpdatePeerWorkVerification(peerUUID: string, updatedData: UpdatePeerWorkVerificationDto) {
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

    const upadtedFieldsArr = Object.keys(updatedData.verificationFields);
    const mandatoryFieldsArr = Object.keys(peer.mandatoryVerificationFields);
    const optionalFieldsArr = Object.keys(peer.optionalVerificationFields);
    const otherQuestionFieldsArr = Object.keys(peer.otherQuestionFields);
    const mandatoryQuestionFieldsArr = Object.keys(peer.mandatoryQuestionFields);

    const union = [...new Set([...mandatoryFieldsArr, ...optionalFieldsArr, ...otherQuestionFieldsArr, ...mandatoryQuestionFieldsArr])];
    const invalid_fields: string[] = [];
    if (
      !upadtedFieldsArr.every((field) => {
        const res = union.includes(field);
        if (!res) {
          invalid_fields.push(field);
        }
        return res;
      })
    ) {
      console.error(`Invalid Fields: ${invalid_fields}`);
      throw new HttpException(ErrorEnum.INVALID_VERIFICATION_FIELDS, JSON.stringify(invalid_fields));
    }

    try {
      console.info(`Before Updating Peer Verification Fields: ${peer as WorkPeer}`);
      const source = JSON.parse(JSON.stringify(updatedData.verificationFields));
      const destination = JSON.parse(JSON.stringify(peer));
      copyFieldsFromInstance(source, destination);
      copyFieldsFromInstance(source, destination);
      copyFieldsFromInstance(source, destination);
      copyFieldsFromInstance(source, destination);
      console.info(`Updated Peer Verification Fields: ${peer as WorkPeer}`);

      await WorkPeerModel.findByIdAndUpdate(peerId, { $set: destination }, { new: true });
    } catch (error) {
      throw new HttpException(ErrorEnum.INVALID_VERIFICATION_FIELDS, error.message);
    }

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
