import jwt from 'jsonwebtoken';
import {
  Body,
  Controller,
  Post,
  Response,
  Route,
  SuccessResponse,
  ValidateError,
} from 'tsoa';

import config from '../../config';
import {
  NotFoundError,
  type NotFoundErrorJSON,
  type ValidateErrorJSON,
} from '../../lib/errors';
import { ParticipantService } from '../../services/participant';
import { SessionService } from '../../services/session';

import type { Participant, Session } from '../../../generated/prisma';

type JoinParams = Pick<Session, 'code'> &
  Pick<Participant, 'name' | 'reconnectionCode'>;

@Route('join')
export class JoinController extends Controller {
  @Response<NotFoundErrorJSON>(404, 'Session Not Found')
  @Response<ValidateErrorJSON>(422, 'Validation Failed')
  @SuccessResponse(201, 'Created')
  @Post()
  public async join(
    @Body() requestBody: JoinParams,
  ): Promise<{ token: string; session: Session; participant: Participant }> {
    const { code } = requestBody;
    if (!code) {
      this.setStatus(422);
      throw new ValidateError(
        {
          code: {
            message: 'Session code is required',
            value: code,
          },
        },
        'Invalid session code',
      );
    }

    const session = await new SessionService().getByCode(code);
    if (!session) {
      this.setStatus(404);
      throw new NotFoundError(
        {
          session: {
            message: 'Session not found',
            value: code,
          },
        },
        'Session not found',
      );
    }

    const participant = await new ParticipantService().create({
      sessionId: session.id,
      name: requestBody.name,
      reconnectionCode: requestBody.reconnectionCode,
    });

    const user: Express.User = {
      sessionId: session.id,
      participantId: participant.id,
      scope: 'participant',
    };

    const token = jwt.sign(
      {
        data: user,
      },
      config.jwtSecret,
      {
        issuer: config.jwtIssuer,
        audience: config.jwtAudience,
        expiresIn: '1h',
      },
    );

    this.setStatus(201);
    return { token, session, participant };
  }
}
