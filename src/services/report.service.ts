import { IdReportResonse, ResidentialReportResponse, ResidentialResponse, WorkExpReportResponse } from '@/dtos/response/report.response';
import { ErrorEnum } from '@/exceptions/errorCodes';
import { HttpException } from '@/exceptions/httpException';
import { DocumentModel } from '@/models/document.model';
import { IDModel } from '@/models/id.model';
import { LocationModel } from '@/models/location.model';
import { ProfileModel } from '@/models/profile.model';
import { ResidentialInfoModel } from '@/models/residentialInfo.model';
import { UserModel } from '@/models/users.model';
import { WorkPeerModel } from '@/models/workExPeer.model';
import { DLResult } from '@/remote/dtos/driving.response';
import { PanResult } from '@/remote/dtos/pan.response';
import { idsService } from './ids.service';
import { residentialPeerService } from './residentialPeer.service';
import { workExperienceService } from './workExperience.service';

class ReportService {
  public async getGreenieAccountDetails(email: string) {
    const user = await UserModel.findOne({ email: email });
    const profile = await ProfileModel.findOne({ user: user._id });

    if (!profile) throw new HttpException(ErrorEnum.PROFILE_ALREADY_EXISTS);

    const res = {
      firstName: profile.firstName,
      lastName: profile.lastName,
      email: user.email,
      mobileNumber: user.mobileNumber,
      greenieId: profile.greenie_id,
    };

    return res;
  }

  public async getWorkExperienceDetails(email: string) {
    const user = await UserModel.findOne({ email: email });
    if (!user) throw new HttpException(ErrorEnum.USER_NOT_FOUND);

    const peerRes = [];
    const workPeer = await WorkPeerModel.find({ user: user._id });

    const workExp = await WorkPeerModel.find({ user: user._id });
    const docs = [];
    for (const work of workExp) {
      const doc = await DocumentModel.find({ workExperience: work._id });
      if (doc) {
        docs.push({
          data: doc,
        });
      }
    }

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
      workExp: await workExperienceService.getWorkExperience(user._id),
      peers: peerRes,
      documents: docs,
    };
    return res;
  }

  public async getResidentialDetails(email: string) {
    const user = await UserModel.findOne({ email: email });

    if (!user) throw new HttpException(ErrorEnum.USER_NOT_FOUND);
    const residentialInfos = await ResidentialInfoModel.find({ user: user._id });
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
        capturedLocation: residentialInfo.capturedLocation ? await LocationModel.findById(residentialInfo.capturedLocation) : {},
        location: residentialInfo.location ? await LocationModel.findById(residentialInfo.location) : {},
      });
    }

    const res: ResidentialReportResponse = {
      residentialInfo: info,
      residentialPeers: await residentialPeerService.getUserPeers(user._id),
    };

    return res;
  }

  public async getIdDetails(email: string) {
    const user = await UserModel.findOne({ email: email });

    if (!user) throw new HttpException(ErrorEnum.USER_NOT_FOUND);
    const id_documents = await IDModel.find({ user: user._id });

    if (!id_documents || id_documents.length === 0) {
      throw new HttpException(ErrorEnum.DOCUMENTS_NOT_FOUND);
    }

    const idReportResponse: IdReportResonse = {
      aadhar: null,
      pan: null,
      dl: null,
    };

    const res = await idsService.getUserIDs(user._id);

    res.forEach(async (id) => {
      if (id.id_type === 'AADHAR') {
        idReportResponse.aadhar = id;
      } else if (id.id_type === 'PAN') {
        const panData = (await IDModel.findById(id.id)).data as PanResult;
        idReportResponse.pan = {
          ...id,
          phoneNumber: panData.user_phone_number,
          aadharLinked: panData.aadhaar_linked_status,
        };
      } else if (id.id_type === 'DRIVING_LICENSE') {
        const dlData = (await IDModel.findById(id.id)).data as DLResult;
        idReportResponse.dl = {
          ...id,
          bloodGroup: dlData.user_blood_group,
          dateOfIssue: dlData.issued_date,
          fatherName: dlData.father_or_husband,
          VehicleType: dlData.vehicle_category_details.map((vehicle) => vehicle.cov),
        };
      }
    });

    return idReportResponse;
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
