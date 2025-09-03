import {
  Body,
  Controller,
  Delete,
  Get,
  Path,
  Post,
  Put,
  Request,
  Response,
  Route,
  Security,
} from 'tsoa';

import {
  UnauthorizedError,
  type UnauthorizedErrorJSON,
  type ValidateErrorJSON,
} from '../../lib/errors';
import {
  QuestionService,
  type QuestionCreationParams,
  type QuestionUpdateParams,
} from '../../services/question';

import type { Question } from '../../../generated/prisma';
import type { Request as ExRequest } from 'express';

@Route('questions')
export class QuestionsController extends Controller {
  @Get('{questionId}')
  public async getQuestion(
    @Path() questionId: string,
  ): Promise<Question | null> {
    return await new QuestionService().getById(questionId);
  }

  @Response<ValidateErrorJSON>(422, 'Validation Failed')
  @Response<UnauthorizedErrorJSON>(401, 'Unauthorized')
  @Security('jwt', ['admin'])
  @Post()
  public async createQuestion(
    @Body() requestBody: QuestionCreationParams,
    @Request() exReq: ExRequest,
  ): Promise<Question> {
    const user = exReq.user;
    if (!user) {
      this.setStatus(401);
      throw new UnauthorizedError({}, 'Unauthorized');
    }

    if (!user.participantId) {
      this.setStatus(401);
      throw new UnauthorizedError({}, 'Unauthorized');
    }

    return await new QuestionService().create({
      sessionId: requestBody.sessionId,
      title: requestBody.title,
      maxPoints: requestBody.maxPoints,
    });
  }

  @Response<ValidateErrorJSON>(422, 'Validation Failed')
  @Response<UnauthorizedErrorJSON>(401, 'Unauthorized')
  @Security('jwt', ['admin'])
  @Put('{questionId}')
  public async updateQuestion(
    @Path() questionId: string,
    @Body() requestBody: QuestionUpdateParams,
    @Request() exReq: ExRequest,
  ): Promise<Question> {
    const user = exReq.user;
    if (!user) {
      this.setStatus(401);
      throw new UnauthorizedError({}, 'Unauthorized');
    }

    if (!user.participantId) {
      this.setStatus(401);
      throw new UnauthorizedError({}, 'Unauthorized');
    }

    return await new QuestionService().update(questionId, requestBody);
  }

  @Response<UnauthorizedErrorJSON>(401, 'Unauthorized')
  @Security('jwt', ['admin'])
  @Delete('{questionId}')
  public async deleteQuestion(
    @Path() questionId: string,
    @Request() exReq: ExRequest,
  ): Promise<Question> {
    const user = exReq.user;
    if (!user) {
      this.setStatus(401);
      throw new UnauthorizedError({}, 'Unauthorized');
    }

    if (!user.participantId) {
      this.setStatus(401);
      throw new UnauthorizedError({}, 'Unauthorized');
    }

    return await new QuestionService().delete(questionId);
  }
}
