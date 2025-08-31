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
import type { Participant } from '../../generated/prisma';
import {
  ParticipantService,
  ParticipantUpdateParams,
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

  @Response<ValidateErrorJSON>(422, 'Validation Failed')
  @Put('{participantId}')
  public async updateParticipant(
    @Path() participantId: string,
    @Body() requestBody: ParticipantUpdateParams,
  ): Promise<Participant> {
    return await new ParticipantService().update(participantId, requestBody);
  }

  @Delete('{participantId}')
  public async deleteParticipant(
    @Path() participantId: string,
  ): Promise<Participant> {
    return await new ParticipantService().delete(participantId);
  }
}
