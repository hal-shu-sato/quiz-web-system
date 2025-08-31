import {
  Body,
  Controller,
  Delete,
  Get,
  Path,
  Post,
  Put,
  Response,
  Route,
} from 'tsoa';
import type { Answer } from '../../generated/prisma';
import {
  AnswerService,
  type AnswerUpdateParams,
  type AnswerCreationParams,
} from '../../services/answer';
import { ValidateErrorJSON } from '../../types/errors';

@Route('answers')
export class AnswersController extends Controller {
  @Get('{answerId}')
  public async getAnswer(@Path() answerId: string): Promise<Answer | null> {
    return await new AnswerService().getById(answerId);
  }

  @Response<ValidateErrorJSON>(422, 'Validation Failed')
  @Post()
  public async createAnswer(
    @Body() requestBody: AnswerCreationParams,
  ): Promise<Answer> {
    return await new AnswerService().create({
      questionId: requestBody.questionId,
      participantId: requestBody.participantId,
      answerType: requestBody.answerType,
      answerText: requestBody.answerText,
      answerImagePath: requestBody.answerImagePath,
      judgmentResult: requestBody.judgmentResult,
      awardedPoints: requestBody.awardedPoints,
    });
  }

  @Response<ValidateErrorJSON>(422, 'Validation Failed')
  @Put('{answerId}')
  public async updateAnswer(
    @Path() answerId: string,
    @Body() requestBody: AnswerUpdateParams,
  ): Promise<Answer> {
    return await new AnswerService().update(answerId, requestBody);
  }

  @Delete('{answerId}')
  public async deleteAnswer(@Path() answerId: string): Promise<Answer> {
    return await new AnswerService().delete(answerId);
  }
}
