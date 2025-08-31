import { Body, Controller, Post, Request, Response, Route } from 'tsoa';

import { ParticipantService } from '../../services/participant';
import { SessionService } from '../../services/session';

import type { Participant, Session } from '../../generated/prisma';
import type { NotFoundErrorJSON, ValidateErrorJSON } from '../../types/errors';
import type { Request as ExRequest } from 'express';

type LoginParams = {
  code: NonNullable<Session['code']>;
  reconnectionCode: NonNullable<Participant['reconnectionCode']>;
};

@Route('login')
export class LoginController extends Controller {
  @Response<NotFoundErrorJSON>(404, 'Session or Participant Not Found')
  @Response<ValidateErrorJSON>(422, 'Validation Failed')
  @Post()
  public async login(
    @Body() requestBody: LoginParams,
    @Request() exReq: ExRequest,
  ): Promise<{ session: Session; participant: Participant }> {
    const session = await new SessionService().getByCode(requestBody.code);
    if (!session) {
      this.setStatus(404);
      throw new Error('Session not found');
    }

    const participant = await new ParticipantService().getByReconnectionCode(
      session.id,
      requestBody.reconnectionCode,
    );
    if (!participant) {
      this.setStatus(404);
      throw new Error('Participant not found');
    }

    exReq.session.sessionId = session.id;
    exReq.session.participantId = participant.id;
    exReq.session.isAdmin = false;

    return { session, participant };
  }
}
