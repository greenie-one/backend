import { ErrorEnum } from "@/exceptions/errorCodes";
import { HttpException } from "@/exceptions/httpException";
import { IDModel } from "@/models/id.model";
import { ProfileModel } from "@/models/profile.model";
import { ResidentialInfoModel } from "@/models/residentialInfo.model";
import { ResidentialPeerModel } from "@/models/residentialPeer.model";
import { UserModel } from "@/models/users.model";
import { WorkPeerModel } from "@/models/workExPeer.model";
import { WorkExperienceModel } from "@/models/workExperience.model";

class ReportService {
  public async getGreenieAccountDetails(email:string) {
    const profile = await ProfileModel.findOne({email:email});
    
    if(!profile)
      throw new HttpException(ErrorEnum.PROFILE_ALREADY_EXISTS);
    
    const res ={
      greenieId:profile.greenie_id ,
    }

    return res ;
  }

  public async getWorkExperienceDetails(email:string) {
    const user =await UserModel.findOne({email:email}) ;
    
    if(!user)
    throw new HttpException(ErrorEnum.USER_NOT_FOUND);

    const workExperiences = await WorkExperienceModel.find({ user: user._id });

    if (!workExperiences) {
      throw new HttpException(ErrorEnum.WORKEXPERIENCE_NOT_FOUND);
    }

    const res= [] ;
    for (const workExp of workExperiences) {
      const workExPeer = await WorkPeerModel.findOne({ref:workExp._id})
      res.push({
        designation: workExp.designation,
        companyName: workExp.companyName,
        companyType:workExp.companyType,
        companyId:workExp.companyId ,
        linkedInUrl:workExp.linkedInUrl ,
        workEmail:workExp.email ,
        dateOfJoining :workExp.dateOfJoining ,
        dateOfLeaving :workExp.dateOfLeaving ,
        worktype:workExp.workType,
        peerName :workExPeer.name,
        verificationBy:workExPeer.verificationBy,
        selectedFields:workExPeer.selectedFields,
        allQuestions:workExPeer.allQuestions,
        otherQuestions:workExPeer.otherQuestions,
        skills:workExPeer.skills,
        documents:workExPeer.documents,
        isVerified:workExPeer.isVerificationCompleted
      });
    }
    return res;
  }
  
  public async getResidentialDetails(email:string) {
    const user =await UserModel.findOne({email:email}) ;
    
    if(!user)
    throw new HttpException(ErrorEnum.USER_NOT_FOUND);

    const residentialInfos = await ResidentialInfoModel.find({ user: user._id });
    if (!residentialInfos) {
      throw new HttpException(ErrorEnum.RESIDENTIAL_INFO_NOT_FOUND);
    }

    const res= [];
    for (const residentialInfo of residentialInfos) {
      const residentPeer = await ResidentialPeerModel.findOne({ ref: residentialInfo._id });
      res.push({
        id: residentialInfo._id.toString(),
        address_line_1: residentialInfo.address_line_1,
        address_line_2: residentialInfo.address_line_2,
        landmark: residentialInfo.landmark,
        pincode: residentialInfo.pincode,
        startDate :residentialInfo.start_date ,
        endDate :residentialInfo.end_date ,
        city: residentialInfo.city,
        country:residentialInfo.country,
        addressType: residentialInfo.addressType,
        location:residentialInfo.location,
        capturedLocation:residentialInfo.capturedLocation,
        isVerified:residentPeer.isVerificationCompleted,
        verifiedBy :residentPeer.verificationBy,
      });
    }

    return res ;
  }

  public async getIdDetails(email:string){
    const user =await UserModel.findOne({email:email}) ;
    
    if(!user)
    throw new HttpException(ErrorEnum.USER_NOT_FOUND);

    const Id = await IDModel.find({ user: user._id });

    if (!Id) {
      throw new HttpException(ErrorEnum.IDENTITY_NOT_FOUND);
    }

    const res= [] ;
    for (const ids of Id) {
      res.push({
        idType:ids.id_type,
        idNumber :ids.id_number,
        data:ids.data,
        address:ids.address,
        normalizedAddress:ids.normalizedAddress,
        location:ids.location,
      });
    }
    return res;
  }

  public async getAllDetials(email:string){
      return{
        account_details: this.getGreenieAccountDetails(email),
        workExperience_details :this.getWorkExperienceDetails(email),
        Residential_details :this.getResidentialDetails(email) ,
        id_details :this.getIdDetails(email) 
      }
  }
}

export const reportService = new ReportService();