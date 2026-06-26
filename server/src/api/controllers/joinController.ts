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
import { generateReconnectionCode } from '../../lib/reconnectionCode';
import {
  NotFoundError,
  type NotFoundErrorJSON,
  type ValidateErrorJSON,
} from '../../lib/errors';
import { ParticipantService } from '../../services/participant';
import { SessionService } from '../../services/session';

import type { Participant, Session } from '../../../generated/prisma';

type JoinParams = Pick<Session, 'code'> &
  Partial<Pick<Participant, 'name' | 'reconnectionCode'>>;

function signParticipantToken(sessionId: string, participantId: string) {
  const user: Express.User = {
    sessionId,
    participantId,
    scope: 'participant',
  };

  return jwt.sign({ data: user }, config.jwtSecret, {
    issuer: config.jwtIssuer,
    audience: config.jwtAudience,
    expiresIn: '24h',
  });
}

@Route('join')
export class JoinController extends Controller {
  @Response<NotFoundErrorJSON>(404, 'Session Not Found')
  @Response<ValidateErrorJSON>(422, 'Validation Failed')
  @SuccessResponse(201, 'Created')
  @Post()
  public async join(
    @Body() requestBody: JoinParams,
  ): Promise<{ token: string; session: Session; participant: Participant }> {
    const { code, name, reconnectionCode } = requestBody;
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

    if (!name?.trim()) {
      this.setStatus(422);
      throw new ValidateError(
        {
          name: {
            message: 'Name is required',
            value: name,
          },
        },
        'Invalid name',
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

    const participantService = new ParticipantService();

    if (reconnectionCode) {
      const existing = await participantService.getByReconnectionCode(
        session.id,
        reconnectionCode,
      );

      if (existing) {
        const participant = await participantService.update(existing.id, {
          name: name.trim(),
        });

        return {
          token: signParticipantToken(session.id, participant.id),
          session,
          participant,
        };
      }
    }

    let nextCode = reconnectionCode?.trim() || generateReconnectionCode();
    let attempts = 0;

    while (attempts < 10) {
      const duplicate = await participantService.getByReconnectionCode(
        session.id,
        nextCode,
      );

      if (!duplicate) {
        break;
      }

      nextCode = generateReconnectionCode();
      attempts += 1;
    }

    const participant = await participantService.create({
      sessionId: session.id,
      name: name.trim(),
      reconnectionCode: nextCode,
    });

    this.setStatus(201);
    return {
      token: signParticipantToken(session.id, participant.id),
      session,
      participant,
    };
  }
}
