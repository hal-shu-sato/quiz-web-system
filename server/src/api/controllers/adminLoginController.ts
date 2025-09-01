import {
  Body,
  Controller,
  Post,
  Request,
  Response,
  Route,
  ValidateError,
} from 'tsoa';

import {
  NotFoundError,
  type NotFoundErrorJSON,
  type ValidateErrorJSON,
} from '../../lib/errors';
import { SessionService } from '../../services/session';

import type { Session } from '../../../generated/prisma';
import type { Request as ExRequest } from 'express';

type AdminLoginParams = Pick<Session, 'code'>;

@Route('admin/login')
export class AdminLoginController extends Controller {
  @Response<NotFoundErrorJSON>(404, 'Session Not Found')
  @Response<ValidateErrorJSON>(422, 'Validation Failed')
  @Post()
  public async adminLogin(
    @Body() requestBody: AdminLoginParams,
    @Request() exReq: ExRequest,
  ): Promise<Session> {
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

    exReq.session.sessionId = session.id;
    exReq.session.participantId = 'admin';
    exReq.session.isAdmin = true;

    return session;
  }
}
