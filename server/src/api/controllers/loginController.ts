import jwt from 'jsonwebtoken';
import {
  Body,
  Controller,
  Post,
  Response,
  Route,
  ValidateError,
  type FieldErrors,
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

type LoginParams = Pick<Session, 'code'> &
  Pick<Participant, 'reconnectionCode'>;

@Route('login')
export class LoginController extends Controller {
  @Response<NotFoundErrorJSON>(404, 'Session or Participant Not Found')
  @Response<ValidateErrorJSON>(422, 'Validation Failed')
  @Post()
  public async login(
    @Body() requestBody: LoginParams,
  ): Promise<{ token: string; session: Session; participant: Participant }> {
    const { code, reconnectionCode } = requestBody;
    if (!code || !reconnectionCode) {
      const fields: FieldErrors = {};
      if (!code) {
        fields.code = {
          message: 'Session code is required',
          value: code,
        };
      }
      if (!reconnectionCode) {
        fields.reconnectionCode = {
          message: 'Reconnection code is required',
          value: reconnectionCode,
        };
      }

      this.setStatus(422);
      throw new ValidateError(
        fields,
        'Invalid session code or reconnection code',
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

    const participant = await new ParticipantService().getByReconnectionCode(
      session.id,
      reconnectionCode,
    );
    if (!participant) {
      this.setStatus(404);
      throw new NotFoundError(
        {
          participant: {
            message: 'Participant not found',
            value: reconnectionCode,
          },
        },
        'Participant not found',
      );
    }

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

    return { token, session, participant };
  }
}
