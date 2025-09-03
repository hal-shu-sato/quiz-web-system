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
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
  type ForbiddenErrorJson,
  type NotFoundErrorJSON,
  type UnauthorizedErrorJSON,
  type ValidateErrorJSON,
} from '../../lib/errors';
import {
  AnswerService,
  type AnswerUpdateParams,
  type AnswerCreationParams,
} from '../../services/answer';

import type { Answer } from '../../../generated/prisma';
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

  @Response<ValidateErrorJSON>(422, 'Validation Failed')
  @Response<UnauthorizedErrorJSON>(401, 'Unauthorized')
  @Response<ForbiddenErrorJson>(403, 'Forbidden')
  @Security('jwt')
  @Post()
  public async createAnswer(
    @Body() requestBody: AnswerCreationParams,
    @Request() exReq: ExRequest,
  ): Promise<Answer> {
    const user = exReq.user;
    if (!user) {
      this.setStatus(401);
      throw new UnauthorizedError({}, 'Unauthorized');
    }

    const userParticipantId = user.participantId;
    if (!userParticipantId) {
      this.setStatus(401);
      throw new UnauthorizedError({}, 'Unauthorized');
    }

    if (
      userParticipantId !== requestBody.participantId &&
      user.scope !== 'admin'
    ) {
      this.setStatus(403);
      throw new ForbiddenError({}, 'Only yourself or admin can create answer');
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

  @Response<ValidateErrorJSON>(422, 'Validation Failed')
  @Response<UnauthorizedErrorJSON>(401, 'Unauthorized')
  @Response<NotFoundErrorJSON>(404, 'Not Found')
  @Response<ForbiddenErrorJson>(403, 'Forbidden')
  @Security('jwt')
  @Put('{answerId}')
  public async updateAnswer(
    @Path() answerId: string,
    @Body() requestBody: AnswerUpdateParams,
    @Request() exReq: ExRequest,
  ): Promise<Answer> {
    const user = exReq.user;
    if (!user) {
      this.setStatus(401);
      throw new UnauthorizedError({}, 'Unauthorized');
    }

    const userParticipantId = user.participantId;
    if (!userParticipantId) {
      this.setStatus(401);
      throw new UnauthorizedError({}, 'Unauthorized');
    }

    const answer = await new AnswerService().getById(answerId);
    if (!answer) {
      this.setStatus(404);
      throw new NotFoundError(
        {
          answer: {
            message: 'Answer not found',
            value: answerId,
          },
        },
        'Answer not found',
      );
    }

    if (userParticipantId !== answer.participantId && user.scope !== 'admin') {
      this.setStatus(403);
      throw new ForbiddenError({}, 'Only yourself or admin can update answer');
    }

    return await new AnswerService().update(answerId, requestBody);
  }

  @Response<UnauthorizedErrorJSON>(401, 'Unauthorized')
  @Response<ForbiddenErrorJson>(403, 'Forbidden')
  @Response<NotFoundErrorJSON>(404, 'Not Found')
  @Security('jwt')
  @Delete('{answerId}')
  public async deleteAnswer(
    @Path() answerId: string,
    @Request() exReq: ExRequest,
  ): Promise<Answer> {
    const user = exReq.user;
    if (!user) {
      this.setStatus(401);
      throw new UnauthorizedError({}, 'Unauthorized');
    }

    const userParticipantId = user.participantId;
    if (!userParticipantId) {
      this.setStatus(401);
      throw new UnauthorizedError({}, 'Unauthorized');
    }

    const answer = await new AnswerService().getById(answerId);
    if (!answer) {
      this.setStatus(404);
      throw new NotFoundError(
        {
          answer: {
            message: 'Answer not found',
            value: answerId,
          },
        },
        'Answer not found',
      );
    }

    if (userParticipantId !== answer.participantId && user.scope !== 'admin') {
      this.setStatus(403);
      throw new ForbiddenError({}, 'Only yourself or admin can delete answer');
    }

    return await new AnswerService().delete(answerId);
  }
}
