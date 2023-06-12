import { AddIDDto } from '@/dtos/ids.dto';
import { ErrorEnum } from '@/exceptions/errorCodes';
import { HttpException } from '@/exceptions/httpException';
import { ID, IDModel, IDTypeEnum } from '@/models/id.model';
import { AadhaarVerification } from '@/remote/verification/aadhar.remote';

class IDsService {
  public async getUserIDs(userId: string): Promise<ID[]> {
    const id_document: ID[] = await IDModel.find({ user: userId });
    if (!id_document) {
      throw new HttpException(ErrorEnum.DOCUMENTS_NOT_FOUND);
    }
    return id_document;
  }

  public async requestAadharOtp(userId: string, addIDDto: AddIDDto) {
    const { id_number } = addIDDto;
    const newId = await IDModel.create({
      id_type: IDTypeEnum.AADHAR,
      id_number,
      user: userId,
    });

    const otpResponse = await AadhaarVerification.requestOtp(id_number, newId._id.toString());
    console.log(otpResponse);

    newId.id_data = otpResponse;
    await newId.save();

    return otpResponse;
  }

  public async verifyAadharOtp(userId: string, addIDDto: AddIDDto) {
    const { otp } = addIDDto;

    // Retrieve the ID document based on the ID type and number
    const idDocument = await IDModel.findOne({
      id_type: IDTypeEnum.AADHAR,
      id_number: addIDDto.id_number,
    });

    if (!idDocument) {
      throw new HttpException(ErrorEnum.DOCUMENT_NOT_FOUND);
    }

    const verificationResponse = await AadhaarVerification.verifyOtp(idDocument.id_data?.request_id, otp, idDocument.id_data?.task_id);

    if (verificationResponse) {
      // Update the ID document with the Aadhar details
      idDocument.id_data = verificationResponse;
      await idDocument.save();
    }

    return verificationResponse;
  }
}

export const idsService = new IDsService();
