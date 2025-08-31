import { Body, Controller, Post, Response, Route, SuccessResponse } from 'tsoa';

import { ParticipantService } from '../../services/participant';
import { SessionService } from '../../services/session';

import type { Participant, Session } from '../../generated/prisma';
import type { NotFoundErrorJSON, ValidateErrorJSON } from '../../types/errors';

type JoinParams = {
  name: Participant['name'];
  code: NonNullable<Session['code']>;
  reconnectionCode: NonNullable<Participant['reconnectionCode']>;
};

@Route('join')
export class JoinController extends Controller {
  @Response<NotFoundErrorJSON>(404, 'Session Not Found')
  @Response<ValidateErrorJSON>(422, 'Validation Failed')
  @SuccessResponse(201, 'Created')
  @Post()
  public async join(
    @Body() requestBody: JoinParams,
  ): Promise<{ session: Session; participant: Participant }> {
    const session = await new SessionService().getByCode(requestBody.code);
    if (!session) {
      this.setStatus(404);
      throw new Error('Session not found');
    }

    const { id: sessionId } = session;
    const participant = await new ParticipantService().create({
      sessionId,
      name: requestBody.name,
      reconnectionCode: requestBody.reconnectionCode,
    });

    return { session, participant };
  }
}
