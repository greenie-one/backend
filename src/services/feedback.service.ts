import { AddFeedbackDto } from "@/dtos/request/feedback.dto";
import { FeedbackModel } from "@/models/feedback.model";
import { ErrorEnum } from '@/exceptions/errorCodes';
import { HttpException } from '@/exceptions/httpException';
import { FeedbackType } from "@/dtos/request/feedback.dto";

export class FeedbackService {
  public async addFeedback(userID : string, data: AddFeedbackDto){
    try {
      const feedback = await FeedbackModel.findOne({user: userID, type: data.type});
      if(feedback){
        throw new HttpException(ErrorEnum.FEEDBACK_ALREADY_ADDED);
      }
      await FeedbackModel.create({
        ...data,
        user: userID,
      })
      return { success : true}
    } catch (error) {
      console.log(error);
      throw new HttpException(ErrorEnum.FEEDBACK_ERROR);
    }
  }

  public async getFeedbacks(userID : string, type : FeedbackType ){
  try {
    const feedback = await FeedbackModel.findOne({user: userID, type: type})
    if (feedback) {
      return { feedback : false }
    }
    return { feedback : true }
  } catch (error) {
    console.log(error);
    throw new HttpException(ErrorEnum.FEEDBACK_ERROR);
  }
  }
}

export const feedbackService =  new FeedbackService();