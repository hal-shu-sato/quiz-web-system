import { Body, Controller, Get, Path, Post, Route, Response } from 'tsoa';
import type { Participant } from '../../generated/prisma';
import {
  ParticipantService,
  type ParticipantCreationParams,
} from '../../services/participant';
import { ValidateErrorJSON } from '../../types/errors';

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
}
