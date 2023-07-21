import { getSharedResponseDTO, sharingDTO, updateSharingPeerStatesList } from '@/dtos/sharing.dto';
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
              sharedWithRef: data.sharedWithId,
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
              sharedWithRef: data.sharedWithId,
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

  public async getSharedWithPeerData(peerId: string) {
    const data = await SharingModel.find({ aharedWithRef: peerId, sharedWith: 'Peer' });
    const sharedThingsData: getSharedResponseDTO[] = [];
    for (const item of data) {
      if (item.sharedThing == SharedThing.SKILLS) {
        const fetched = await SkillModel.findById(item.sharedThingRef);
        sharedThingsData.push({
          id: item._id.toString(),
          status: item.status,
          data: {
            id: fetched._id.toString(),
            skillName: fetched.skillName,
            expertise: fetched.expertise,
          },
        });
      } else if (item.sharedThing == SharedThing.DOCUMENT) {
        const fetched = await DocumentModel.findById(item.sharedThingRef);
        sharedThingsData.push({
          id: item._id.toString(),
          status: item.status,
          data: {
            id: fetched._id.toString(),
            name: fetched.name,
            type: fetched.type,
            privateUrl: fetched.privateUrl,
          },
        });
      }
    }
    return { sharedThingsData };
  }

  public async updateShared(peerId: string, stateUpadte: updateSharingPeerStatesList) {
    const data = await SharingModel.find({ sharedWithRef: peerId });
    if (data.length === 0) {
      throw new HttpException(ErrorEnum.SHARING_NOT_FOUND);
    }
    if (data.length !== stateUpadte.data.length) {
      console.error('Length of data and stateUpdate is not same');
      throw new HttpException(ErrorEnum.SHARING_FAILED);
    }
    for (const item of stateUpadte.data) {
      const updated = await SharingModel.findByIdAndUpdate(item.sharingId, { $set: { status: item.status } }, { new: true });
      if (!updated) {
        console.error('Error in updating');
        throw new HttpException(ErrorEnum.SHARING_FAILED);
      }
    }
    return { success: true, message: 'Updated Successfully' };
  }
}

export const sharingService = new SharingService();
