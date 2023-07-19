import { CreateWorkPeerDto, ResponseCreateWorkPeer, UpdatePeerWorkVerificationDto } from '@/dtos/peer.dto';
import { ErrorEnum } from '@/exceptions/errorCodes';
import { HttpException } from '@/exceptions/httpException';
import { ExceptHRQuestionFields, HRQuestionFields, OptionalWorkExFields, WorkPeer, WorkPeerModel, WorkVerificationBy } from '@/models/peer.model';
import { ProfileModel } from '@/models/profile.model';
import { redisClient } from '@/redisClient';
import { otpType } from '@/remote/otp/otp';
import { verification } from '@/remote/peer/verification';
import { copyFieldsFromInstance, createClassInstanceWithFields } from '@/utils/classes';
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
    const base_url = `${env('REMOTE_BASE_URL')}/verification/${peer.verificationBy}/`;

    const mobileUUID = randomUUID().toString();
    const mobileLink = `${base_url}/${mobileUUID}`;

    const emailUUID = randomUUID().toString();
    const emailLink = `${base_url}/${emailUUID}`;

    await redisClient.setEx(mobileUUID, 60 * 60 * 72, JSON.stringify({ peerId: peerId, type: 'mobile' }));
    await redisClient.setEx(emailUUID, 60 * 60 * 72, JSON.stringify({ peerId: peerId, type: 'email' }));

    console.info(`Sending links to ${peer.name} with email ${peer.email} and phone ${peer.phone}`);

    await verification
      .GetPeerVerification(peer.email, peer.phone, peer.name, `${profile.firstName} + ' ' + ${profile.lastName}`, mobileLink, emailLink)
      .catch((err) => {
        console.error(err);
        throw new HttpException(ErrorEnum.Server_ERROR);
      });
    return { success: true, message: 'Link Sent' };
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
    const { email, phone } = peer;
    if (otp_type === 'EMAIL') {
      return await otpService.verifyOTP(email, otp_type, otp);
    } else {
      return await otpService.verifyOTP(phone, otp_type, otp);
    }
  }

  public async getPeerInformation(peerUUID: string): Promise<ResponseCreateWorkPeer> {
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

    if (!peer.emailVerified || !peer.phoneVerified) {
      throw new HttpException(ErrorEnum.PEER_NOT_VERIFIED);
    }

    return peer as ResponseCreateWorkPeer;
  }

  public async createWorkPeer(userId: string, peerData: CreateWorkPeerDto): Promise<ResponseCreateWorkPeer> {
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
    return peer as ResponseCreateWorkPeer;
  }

  public async UpdatePeerWorkVerification(peerUUID: string, updatedData: UpdatePeerWorkVerificationDto) {
    const { peerId } = await this.peerUUIDtoPeerId(peerUUID);
    const peer = await WorkPeerModel.findById(peerId);
    if (!peer) {
      throw new HttpException(ErrorEnum.PEER_NOT_FOUND);
    }
    if (!peer.emailVerified || !peer.phoneVerified) {
      throw new HttpException(ErrorEnum.PEER_NOT_VERIFIED);
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
      copyFieldsFromInstance(updatedData.verificationFields, peer.optionalVerificationFields);
      copyFieldsFromInstance(updatedData.verificationFields, peer.mandatoryVerificationFields);
      copyFieldsFromInstance(updatedData.verificationFields, peer.otherQuestionFields);
      copyFieldsFromInstance(updatedData.verificationFields, peer.mandatoryQuestionFields);
      console.info(`Updated Peer Verification Fields: ${peer as WorkPeer}`);
      peer.save();
    } catch (error) {
      throw new HttpException(ErrorEnum.INVALID_VERIFICATION_FIELDS, error.message);
    }

    return { success: true, message: 'Updated Successfully' };
  }
}

export const peerService = new PeerService();
