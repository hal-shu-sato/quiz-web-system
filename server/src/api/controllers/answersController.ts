import {
  Body,
  Controller,
  Delete,
  Get,
  Path,
  Post,
  Put,
  Query,
  Request,
  Response,
  Route,
  Security,
} from 'tsoa';

import {
  AnswerService,
  type AnswerUpdateParams,
  type AnswerCreationParams,
} from '../../services/answer';

import type { Answer } from '../../../generated/prisma';
import type {
  ForbiddenErrorJson,
  NotFoundErrorJSON,
  UnauthorizedErrorJSON,
  ValidateErrorJSON,
} from '../../types/errors';
import type { Request as ExRequest } from 'express';

@Route('answers')
export class AnswersController extends Controller {
  @Get('{answerId}')
  public async getAnswer(@Path() answerId: string): Promise<Answer | null> {
    return await new AnswerService().getById(answerId);
  }

  @Get()
  public async listAnswersByParticipantId(
    @Query() participantId: string,
  ): Promise<Answer[]> {
    return await new AnswerService().listByParticipantId(participantId);
  }

  @Security('session_auth')
  @Response<ValidateErrorJSON>(422, 'Validation Failed')
  @Response<UnauthorizedErrorJSON>(401, 'Unauthorized')
  @Response<ForbiddenErrorJson>(403, 'Forbidden')
  @Post()
  public async createAnswer(
    @Body() requestBody: AnswerCreationParams,
    @Request() exReq: ExRequest,
  ): Promise<Answer> {
    const sessionParticipantId = exReq.session.participantId;
    if (!sessionParticipantId) {
      this.setStatus(401);
      throw new Error('Unauthorized');
    }

    if (
      sessionParticipantId !== requestBody.participantId &&
      !exReq.session.isAdmin
    ) {
      this.setStatus(403);
      throw new Error('Only yourself or admin can create answer');
    }

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

  @Security('session_auth')
  @Response<ValidateErrorJSON>(422, 'Validation Failed')
  @Response<UnauthorizedErrorJSON>(401, 'Unauthorized')
  @Response<NotFoundErrorJSON>(404, 'Not Found')
  @Response<ForbiddenErrorJson>(403, 'Forbidden')
  @Put('{answerId}')
  public async updateAnswer(
    @Path() answerId: string,
    @Body() requestBody: AnswerUpdateParams,
    @Request() exReq: ExRequest,
  ): Promise<Answer> {
    const sessionParticipantId = exReq.session.participantId;
    if (!sessionParticipantId) {
      this.setStatus(401);
      throw new Error('Unauthorized');
    }

    const answer = await new AnswerService().getById(answerId);
    if (!answer) {
      this.setStatus(404);
      throw new Error('Answer not found');
    }

    if (
      sessionParticipantId !== answer.participantId &&
      !exReq.session.isAdmin
    ) {
      this.setStatus(403);
      throw new Error('Only yourself or admin can update answer');
    }

    return await new AnswerService().update(answerId, requestBody);
  }

  @Security('session_auth')
  @Response<UnauthorizedErrorJSON>(401, 'Unauthorized')
  @Response<ForbiddenErrorJson>(403, 'Forbidden')
  @Response<NotFoundErrorJSON>(404, 'Not Found')
  @Delete('{answerId}')
  public async deleteAnswer(
    @Path() answerId: string,
    @Request() exReq: ExRequest,
  ): Promise<Answer> {
    const sessionParticipantId = exReq.session.participantId;
    if (!sessionParticipantId) {
      this.setStatus(401);
      throw new Error('Unauthorized');
    }

    const answer = await new AnswerService().getById(answerId);
    if (!answer) {
      this.setStatus(404);
      throw new Error('Answer not found');
    }

    if (
      sessionParticipantId !== answer.participantId &&
      !exReq.session.isAdmin
    ) {
      this.setStatus(403);
      throw new Error('Only yourself or admin can delete answer');
    }

    return await new AnswerService().delete(answerId);
  }
}
