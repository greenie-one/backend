import { getSharedResponseDTO, sharingDTO, sharingUpdateStateDTO } from '@/dtos/sharing.dto';
import { ErrorEnum } from '@/exceptions/errorCodes';
import { HttpException } from '@/exceptions/httpException';

import { DocumentModel } from '@/models/document.model';
import { SharedThing, SharingModel } from '@/models/sharing.model';
import { SkillModel } from '@/models/skills.model';

class SharingService {
  public async share(userId: string, data: sharingDTO) {
    const sharingType = data.thing;
    try {
      if (sharingType == SharedThing.SKILLS) {
        // check whether the skill is present with the userid
        data.thingId.forEach((id) => {
          if (SkillModel.findById(id, { user: userId })) {
            SharingModel.create({
              user: userId,
              sharedThing: sharingType,
              sharedThingRef: id,
              sharedWith: data.sharedWith,
              sharedWithRef: data.userId,
            });
          } else {
            throw new HttpException(ErrorEnum.SKILL_NOT_FOUND);
          }
        });
      } else if (sharingType == SharedThing.DOCUMENT) {
        // check whether the document is present with the userid
        data.thingId.forEach((id) => {
          if (DocumentModel.findById(id, { user: userId })) {
            SharingModel.create({
              user: userId,
              sharedThing: sharingType,
              sharedThingRef: id,
              sharedWith: data.sharedWith,
              sharedWithRef: data.userId,
            });
          } else {
            throw new HttpException(ErrorEnum.DOCUMENT_NOT_FOUND);
          }
        });
      }

      return { success: true };
    } catch {
      throw new HttpException(ErrorEnum.SHARING_FAILED);
    }
  }

  public async getSharedWithData(userOrPeerId: string) {
    const data = await SharingModel.find({ sharedWithRef: userOrPeerId });
    let sharedThingsData: getSharedResponseDTO[];
    for (const item of data) {
      if (item.sharedThing == SharedThing.SKILLS) {
        const fetched = await SkillModel.findById(item.sharedThingRef);
        sharedThingsData.push({
          id: item._id.toString(),
          state: item.state,
          data: {
            id: fetched._id.toString(),
            skillName: fetched.skillName,
            workExperience: fetched.workExperience.toString(),
            expertise: fetched.expertise,
          },
        });
      } else if (item.sharedThing == SharedThing.DOCUMENT) {
        const fetched = await DocumentModel.findById(item.sharedThingRef);
        sharedThingsData.push({
          id: item._id.toString(),
          state: item.state,
          data: {
            id: fetched._id.toString(),
            name: fetched.name,
            type: fetched.type,
            privateUrl: fetched.privateUrl,
          },
        });
      }
    }
    return { data: sharedThingsData };
  }

  public async updateShared(userOrPeerId: string, stateUpadte: sharingUpdateStateDTO) {
    const data = await SharingModel.findOne({ id: stateUpadte.sharingId, sharedWithRef: userOrPeerId });
    if (!data) {
      throw new HttpException(ErrorEnum.SHARING_NOT_FOUND);
    }
    const updated = await SharingModel.findByIdAndUpdate(stateUpadte.sharingId, { $set: { state: stateUpadte.state } }, { new: true });
    return { success: true, message: 'Updated Successfully', data: updated };
  }
}

export const sharingService = new SharingService();
