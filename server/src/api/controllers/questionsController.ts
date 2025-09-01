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
  ForbiddenError,
  UnauthorizedError,
  type ForbiddenErrorJson,
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

  @Security('session_auth')
  @Response<ValidateErrorJSON>(422, 'Validation Failed')
  @Response<UnauthorizedErrorJSON>(401, 'Unauthorized')
  @Response<ForbiddenErrorJson>(403, 'Forbidden')
  @Post()
  public async createQuestion(
    @Body() requestBody: QuestionCreationParams,
    @Request() exReq: ExRequest,
  ): Promise<Question> {
    if (!exReq.session.participantId) {
      this.setStatus(401);
      throw new UnauthorizedError({}, 'Unauthorized');
    }

    if (!exReq.session.isAdmin) {
      this.setStatus(403);
      throw new ForbiddenError({}, 'Only admin can create question');
    }

    return await new QuestionService().create({
      sessionId: requestBody.sessionId,
      title: requestBody.title,
      maxPoints: requestBody.maxPoints,
    });
  }

  @Security('session_auth')
  @Response<ValidateErrorJSON>(422, 'Validation Failed')
  @Response<UnauthorizedErrorJSON>(401, 'Unauthorized')
  @Response<ForbiddenErrorJson>(403, 'Forbidden')
  @Put('{questionId}')
  public async updateQuestion(
    @Path() questionId: string,
    @Body() requestBody: QuestionUpdateParams,
    @Request() exReq: ExRequest,
  ): Promise<Question> {
    if (!exReq.session.participantId) {
      this.setStatus(401);
      throw new UnauthorizedError({}, 'Unauthorized');
    }

    if (!exReq.session.isAdmin) {
      this.setStatus(403);
      throw new ForbiddenError({}, 'Only admin can update question');
    }

    return await new QuestionService().update(questionId, requestBody);
  }

  @Security('session_auth')
  @Response<UnauthorizedErrorJSON>(401, 'Unauthorized')
  @Response<ForbiddenErrorJson>(403, 'Forbidden')
  @Delete('{questionId}')
  public async deleteQuestion(
    @Path() questionId: string,
    @Request() exReq: ExRequest,
  ): Promise<Question> {
    if (!exReq.session.participantId) {
      this.setStatus(401);
      throw new UnauthorizedError({}, 'Unauthorized');
    }

    if (!exReq.session.isAdmin) {
      this.setStatus(403);
      throw new ForbiddenError({}, 'Only admin can delete question');
    }

    return await new QuestionService().delete(questionId);
  }
}
