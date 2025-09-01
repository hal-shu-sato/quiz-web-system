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
  ParticipantService,
  type ParticipantCreationParams,
  type ParticipantUpdateParams,
} from '../../services/participant';

import type { Participant } from '../../../generated/prisma';
import type {
  ForbiddenErrorJson,
  UnauthorizedErrorJSON,
  ValidateErrorJSON,
} from '../../lib/errors';
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

  @Security('session_auth')
  @Response<ValidateErrorJSON>(422, 'Validation Failed')
  @Response<UnauthorizedErrorJSON>(401, 'Unauthorized')
  @Response<ForbiddenErrorJson>(403, 'Forbidden')
  @Put('{participantId}')
  public async updateParticipant(
    @Path() participantId: string,
    @Body() requestBody: ParticipantUpdateParams,
    @Request() exReq: ExRequest,
  ): Promise<Participant> {
    const sessionParticipantId = exReq.session.participantId;
    if (!sessionParticipantId) {
      this.setStatus(401);
      throw new Error('Unauthorized');
    }

    if (sessionParticipantId !== participantId && !exReq.session.isAdmin) {
      this.setStatus(403);
      throw new Error('Only yourself or admin can update participant');
    }

    return await new ParticipantService().update(participantId, requestBody);
  }

  @Security('session_auth')
  @Delete('{participantId}')
  @Response<UnauthorizedErrorJSON>(401, 'Unauthorized')
  @Response<ForbiddenErrorJson>(403, 'Forbidden')
  public async deleteParticipant(
    @Path() participantId: string,
    @Request() exReq: ExRequest,
  ): Promise<Participant> {
    const sessionParticipantId = exReq.session.participantId;
    if (!sessionParticipantId) {
      this.setStatus(401);
      throw new Error('Unauthorized');
    }

    if (sessionParticipantId !== participantId && !exReq.session.isAdmin) {
      this.setStatus(403);
      throw new Error('Only yourself or admin can delete participant');
    }

    return await new ParticipantService().delete(participantId);
  }
}
