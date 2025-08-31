import { Body, Controller, Post, Response, Route } from 'tsoa';

import { ParticipantService } from '../../services/participant';
import { SessionService } from '../../services/session';

import type { Participant, Session } from '../../generated/prisma';
import type { NotFoundErrorJSON, ValidateErrorJSON } from '../../types/errors';

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
  ): Promise<{ session: Session; participant: Participant }> {
    const session = await new SessionService().getByCode(requestBody.code);
    if (!session) {
      this.setStatus(404);
      throw new Error('Session not found');
    }

    const { id: sessionId } = session;
    const participant = await new ParticipantService().getByReconnectionCode(
      sessionId,
      requestBody.reconnectionCode,
    );
    if (!participant) {
      this.setStatus(404);
      throw new Error('Participant not found');
    }

    return { session, participant };
  }
}
