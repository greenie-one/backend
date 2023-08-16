import { ResidentialReportResponse, WorkExpReportResponse } from '@/dtos/response/report.response';
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
  public async getGreenieAccountDetails(email: string) {
    const user = await UserModel.findOne({ email: email });
    const profile = await ProfileModel.findOne({ user: user._id });

    if (!profile) throw new HttpException(ErrorEnum.PROFILE_ALREADY_EXISTS);

    const res = {
      greenieId: profile.greenie_id,
    };

    return res;
  }

  public async getWorkExperienceDetails(email: string) {
    const user = await UserModel.findOne({ email: email });
    if (!user) throw new HttpException(ErrorEnum.USER_NOT_FOUND);

    const peerRes =[];
    const workPeer = await WorkPeerModel.find({user:user._id}) ;

    for(const peer of workPeer){
      peerRes.push({
        ref: peer.ref,
        name: peer.name,
        email: peer.email,
        phone: peer.phone,
        emailVerified:peer.emailVerified ,
        phoneVerified:peer.phoneVerified ,
        verificationBy: peer.verificationBy,
        selectedFields: peer.selectedFields,
        allQuestions: peer.allQuestions,
        otherQuestions: peer.otherQuestions,
        skills: peer.skills ,
        documents: peer.documents,
        createdAt:peer.createdAt ,
        updatedAt :peer.updatedAt,
        isVerificationCompleted: peer.isVerificationCompleted
      })
    }
    
    const res:WorkExpReportResponse={
      workExp:await workExperienceService.getWorkExperience(user._id) ,
      peers:peerRes,
    }
    return res;
  }

  public async getResidentialDetails(email: string) {
    const user = await UserModel.findOne({ email: email });

    if (!user) throw new HttpException(ErrorEnum.USER_NOT_FOUND);
    
    const res:ResidentialReportResponse ={
      residentialInfo :await residentialInfoService.getUserResidentialInfo(user._id),
      residentialPeers:await residentialPeerService.getUserPeers(user._id),
    }

    return res;
  }

  public async getIdDetails(email: string) {
    const user = await UserModel.findOne({ email: email });

    if (!user) throw new HttpException(ErrorEnum.USER_NOT_FOUND);
    
    const res = await idsService.getUserIDs(user._id);
    return res;
  }

  public async getAllDetails(email: string) {
    const user = await UserModel.findOne({ email: email });

    if (!user) throw new HttpException(ErrorEnum.USER_NOT_FOUND);

    return {
      accountDetails: await this.getGreenieAccountDetails(email),
      workExperienceDetails: await this.getWorkExperienceDetails(email),
      ResidentialDetails: await this.getResidentialDetails(email),
      idDetails: await this.getIdDetails(email),
    };
  }
}

export const reportService = new ReportService();
