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
  ParticipantService,
  type ParticipantCreationParams,
  type ParticipantUpdateParams,
} from '../../services/participant';

import type { Participant } from '../../../generated/prisma';
import type { Request as ExRequest } from 'express';

@Route('participants')
export class ParticipantsController extends Controller {
  @Get('{participantId}')
  public async getParticipant(
    @Path() participantId: string,
  ): Promise<Participant | null> {
    return await new ParticipantService().getById(participantId);
  }

  @Response<ValidateErrorJSON>(422, 'Validation Failed')
  @Post()
  public async createParticipant(
    @Body() requestBody: ParticipantCreationParams,
  ): Promise<Participant> {
    return await new ParticipantService().create({
      name: requestBody.name,
      sessionId: requestBody.sessionId,
      reconnectionCode: requestBody.reconnectionCode,
    });
  }

  @Response<ValidateErrorJSON>(422, 'Validation Failed')
  @Response<UnauthorizedErrorJSON>(401, 'Unauthorized')
  @Response<ForbiddenErrorJson>(403, 'Forbidden')
  @Security('jwt')
  @Put('{participantId}')
  public async updateParticipant(
    @Path() participantId: string,
    @Body() requestBody: ParticipantUpdateParams,
    @Request() exReq: ExRequest,
  ): Promise<Participant> {
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

    if (userParticipantId !== participantId && user.scope !== 'admin') {
      this.setStatus(403);
      throw new ForbiddenError(
        {},
        'Only yourself or admin can update participant',
      );
    }

    return await new ParticipantService().update(participantId, requestBody);
  }

  @Response<UnauthorizedErrorJSON>(401, 'Unauthorized')
  @Response<ForbiddenErrorJson>(403, 'Forbidden')
  @Security('jwt')
  @Delete('{participantId}')
  public async deleteParticipant(
    @Path() participantId: string,
    @Request() exReq: ExRequest,
  ): Promise<Participant> {
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

    if (userParticipantId !== participantId && user.scope !== 'admin') {
      this.setStatus(403);
      throw new ForbiddenError(
        {},
        'Only yourself or admin can delete participant',
      );
    }

    return await new ParticipantService().delete(participantId);
  }
}
