import jwt from 'jsonwebtoken';
import { Body, Controller, Post, Response, Route, ValidateError } from 'tsoa';

import config from '../../config';
import {
  NotFoundError,
  type NotFoundErrorJSON,
  type ValidateErrorJSON,
} from '../../lib/errors';
import { SessionService } from '../../services/session';

import type { Session } from '../../../generated/prisma';

type AdminLoginParams = Pick<Session, 'code'>;

@Route('admin/login')
export class AdminLoginController extends Controller {
  @Response<NotFoundErrorJSON>(404, 'Session Not Found')
  @Response<ValidateErrorJSON>(422, 'Validation Failed')
  @Post()
  public async adminLogin(
    @Body() requestBody: AdminLoginParams,
  ): Promise<{ token: string; session: Session }> {
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

    const user: Express.User = {
      sessionId: session.id,
      participantId: 'admin',
      scope: 'admin',
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

    return { token, session };
  }
}
