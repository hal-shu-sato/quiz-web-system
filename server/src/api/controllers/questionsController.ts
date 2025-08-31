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
import type { Question } from '../../generated/prisma';
import {
  QuestionService,
  QuestionUpdateParams,
  type QuestionCreationParams,
} from '../../services/question';
import { ValidateErrorJSON } from '../../types/errors';

@Route('questions')
export class QuestionsController extends Controller {
  @Get('{questionId}')
  public async getQuestion(
    @Path() questionId: string,
  ): Promise<Question | null> {
    return await new QuestionService().getById(questionId);
  }

  @Response<ValidateErrorJSON>(422, 'Validation Failed')
  @Post()
  public async createQuestion(
    @Body() requestBody: QuestionCreationParams,
  ): Promise<Question> {
    return await new QuestionService().create({
      sessionId: requestBody.sessionId,
      title: requestBody.title,
      maxPoints: requestBody.maxPoints,
    });
  }

  @Response<ValidateErrorJSON>(422, 'Validation Failed')
  @Put('{questionId}')
  public async updateQuestion(
    @Path() questionId: string,
    @Body() requestBody: QuestionUpdateParams,
  ): Promise<Question> {
    return await new QuestionService().update(questionId, requestBody);
  }

  @Delete('{questionId}')
  public async deleteQuestion(@Path() questionId: string): Promise<Question> {
    return await new QuestionService().delete(questionId);
  }
}
