import { sharingDTO } from '@/dtos/sharing.dto';
import { ErrorEnum } from '@/exceptions/errorCodes';
import { HttpException } from '@/exceptions/httpException';

import { DocumentModel } from '@/models/document.model';
import { SharedThing, SharingModel } from '@/models/sharing.model';
import { SkillModel } from '@/models/skills.model';

class sharingService {
  public async share(userId: string, data: sharingDTO) {
    const sharingType = data.thing;
    try {
      if (sharingType == SharedThing.SKILLS) {
        //check whether the skill is present with the userid
        data.thingId.forEach((id) => {
          if (SkillModel.findById(id, { user: userId })) {
            SharingModel.create({
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
        //check whether the document is present with the userid
        data.thingId.forEach((id) => {
          if (DocumentModel.findById(id, { user: userId })) {
            SharingModel.create({
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
}

export const DocumentsSharingService = new sharingService();
