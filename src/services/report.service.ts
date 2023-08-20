import { ResidentialReportResponse, WorkExpReportResponse, WorkPeerReportResponse } from '@/dtos/response/report.response';
import { ErrorEnum } from '@/exceptions/errorCodes';
import { HttpException } from '@/exceptions/httpException';
import { ProfileModel } from '@/models/profile.model';
import { UserModel } from '@/models/users.model';
import { WorkPeerModel } from '@/models/workExPeer.model';
import { idsService } from './ids.service';
import { residentialInfoService } from './residentialInfo.service';
import { residentialPeerService } from './residentialPeer.service';
import { workExperienceService } from './workExperience.service';

class ReportService {
  public async getGreenieAccountDetails(userId: string) {
    const profile = await ProfileModel.findOne({ user: userId });

    if (!profile) throw new HttpException(ErrorEnum.PROFILE_NOT_FOUND);

    const res = {
      greenieId: profile.greenie_id,
    };

    return res;
  }

  public async getWorkExperienceDetails(userId: string) {
    const peerRes: WorkPeerReportResponse[] = [];
    const workPeer = await WorkPeerModel.find({ user: userId });

    for (const peer of workPeer) {
      peerRes.push({
        ref: peer.ref,
        name: peer.name,
        email: peer.email,
        phone: peer.phone,
        emailVerified: peer.emailVerified,
        phoneVerified: peer.phoneVerified,
        verificationBy: peer.verificationBy,
        selectedFields: peer.selectedFields,
        allQuestions: peer.allQuestions,
        otherQuestions: peer.otherQuestions,
        skills: peer.skills,
        documents: peer.documents,
        createdAt: peer.createdAt,
        updatedAt: peer.updatedAt,
        isVerificationCompleted: peer.isVerificationCompleted,
      });
    }

    const res: WorkExpReportResponse = {
      workExp: await workExperienceService.getWorkExperience(userId),
      peers: peerRes,
    };
    return res;
  }

  public async getResidentialDetails(userId: string) {
    const res: ResidentialReportResponse = {
      residentialInfo: await residentialInfoService.getUserResidentialInfo(userId),
      residentialPeers: await residentialPeerService.getUserPeers(userId),
    };
    return res;
  }

  public async getIdDetails(userId: string) {
    const res = await idsService.getUserIDs(userId);
    return res;
  }

  public async getAllDetails(email: string) {
    const user = await UserModel.findOne({ email: email });

    if (!user) throw new HttpException(ErrorEnum.USER_NOT_FOUND);

    return {
      accountDetails: await this.getGreenieAccountDetails(user._id.toString()),
      workExperienceDetails: await this.getWorkExperienceDetails(user._id.toString()),
      ResidentialDetails: await this.getResidentialDetails(user._id.toString()),
      idDetails: await this.getIdDetails(user._id.toString()),
    };
  }
}

export const reportService = new ReportService();
