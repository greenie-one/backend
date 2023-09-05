import { IDTypeEnum } from '@/dtos/request/ids.dto';
import { IdReportResonse, ResidentialReportResponse, ResidentialResponse, WorkExpReportResponse } from '@/dtos/response/report.response';
import { ErrorEnum } from '@/exceptions/errorCodes';
import { HttpException } from '@/exceptions/httpException';
import { Document, DocumentModel } from '@/models/document.model';
import { IDModel } from '@/models/id.model';
import { ProfileModel } from '@/models/profile.model';
import { ResidentialInfoModel } from '@/models/residentialInfo.model';
import { SkillModel, Skills } from '@/models/skills.model';
import { UserModel } from '@/models/users.model';
import { WorkPeerModel } from '@/models/workExPeer.model';
import { WorkExperienceModel } from '@/models/workExperience.model';
import { DLResult } from '@/remote/dtos/driving.response';
import { PanResult } from '@/remote/dtos/pan.response';
import { blobService } from './blobStorage.service';
import { idsService } from './ids.service';
import { residentialPeerService } from './residentialPeer.service';
import { workExperienceService } from './workExperience.service';

class ReportService {
  public async getGreenieAccountDetails(userId: string) {
    const user = await UserModel.findById(userId);
    const profile = await ProfileModel.findOne({ user: userId });

    if (!profile) throw new HttpException(ErrorEnum.PROFILE_NOT_FOUND);

    const res = {
      firstName: profile.firstName,
      lastName: profile.lastName,
      greenieId: profile.greenie_id,
      email: user.email,
      mobileNumber: user.mobileNumber,
      profilePic: profile.profilePic,
    };

    return res;
  }

  public async getWorkExperienceDetails(userId: string) {
    const peerRes = [];
    const workPeer = await WorkPeerModel.find({ user: userId });
    const workExp = await WorkExperienceModel.find({ user: userId });

    const docs: Document[] = [];
    const skills: Skills[] = [];

    for (const work of workExp) {
      const doc_res: Document[] = await DocumentModel.find({ workExperience: work._id.toString() });
      docs.push(...doc_res);
      const skill_res: Skills[] = await SkillModel.find({ workExperience: work._id.toString() });
      skills.push(...skill_res);
    }

    docs.map(async (document) => {
      document
        .privateUrl = `${document.privateUrl}?token=${blobService.generateDownloadToken(document.privateUrl)}`;
    });

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
      documents: docs,
      skills: skills,
    };
    return res;
  }

  public async getResidentialDetails(userId: string) {
    const residentialInfos = await ResidentialInfoModel.find({ user: userId }).populate("capturedLocation").populate("location");
    if (!residentialInfos) {
      throw new HttpException(ErrorEnum.RESIDENTIAL_INFO_NOT_FOUND);
    }

    const info: ResidentialResponse[] = [];
    for (const residentialInfo of residentialInfos) {
      info.push({
        id: residentialInfo._id.toString(),
        address_line_1: residentialInfo.address_line_1,
        address_line_2: residentialInfo.address_line_2,
        landmark: residentialInfo.landmark,
        pincode: residentialInfo.pincode,
        city: residentialInfo.city,
        state: residentialInfo.state,
        country: residentialInfo.country,
        start_date: residentialInfo.start_date,
        end_date: residentialInfo.end_date,
        addressType: residentialInfo.addressType,
        isVerified: residentialInfo.isVerified,
        capturedLocation: residentialInfo.capturedLocation as object,
        location: residentialInfo.location as object,
        createdAt: residentialInfo.createdAt,
        updatedAt: residentialInfo.updatedAt,
      });
    }

    const res: ResidentialReportResponse = {
      residentialInfo: info,
      residentialPeers: await residentialPeerService.getUserPeers(userId),
    };

    return res;
  }

  public async getIdDetails(userId: string) {
    const idReportResponse: IdReportResonse = {
      aadhar: null,
      pan: null,
      dl: null,
    };

    const res = await idsService.getUserIDs(userId);

    for (const id of res) {
      if (id.id_type === IDTypeEnum.AADHAR) {
        idReportResponse.aadhar = id;
      } else if (id.id_type === IDTypeEnum.PAN) {
        const panData = (await IDModel.findById(id.id)).data as PanResult;
        idReportResponse.pan = {
          ...id,
          phoneNumber: panData.user_phone_number,
          aadharLinked: panData.aadhaar_linked_status,
          pan_type: panData.pan_type,
        };
      } else if (id.id_type === IDTypeEnum.DRIVING_LICENSE) {
        const dlData = (await IDModel.findById(id.id)).data as DLResult;
        idReportResponse.dl = {
          ...id,
          bloodGroup: dlData.user_blood_group,
          dateOfIssue: dlData.issued_date,
          dateOfExpiry: dlData.expiry_date,
          fatherName: dlData.father_or_husband,
          VehicleType: dlData.vehicle_category_details.map((vehicle) => vehicle.cov),
        };
      }
    }
    return idReportResponse;
  }

  public async getAllDetails(email?: string, phone?: string) {
    if (!email && !phone) throw new HttpException(ErrorEnum.VALIDATION_ERROR, 'Query Param either email or phone is required');
    const user = await UserModel.findOne({ email: email, mobileNumber: phone });

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
