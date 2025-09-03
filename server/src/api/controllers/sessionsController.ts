import jwt from 'jsonwebtoken';
import {
  Body,
  Controller,
  Delete,
  Get,
  Path,
  Post,
  Put,
  Request,
  Response,
  Route,
  Security,
} from 'tsoa';

import config from '../../config';
import {
  UnauthorizedError,
  type UnauthorizedErrorJSON,
  type ValidateErrorJSON,
} from '../../lib/errors';
import {
  SessionService,
  type SessionCreationParams,
  type SessionUpdateParams,
} from '../../services/session';

import type { Session } from '../../../generated/prisma';
import type { Request as ExRequest } from 'express';

@Route('sessions')
export class SessionsController extends Controller {
  @Get('{sessionId}')
  public async getSession(@Path() sessionId: string): Promise<Session | null> {
    return await new SessionService().getById(sessionId);
  }

  @Response<ValidateErrorJSON>(422, 'Validation Failed')
  @Post()
  public async createSession(
    @Body() requestBody: SessionCreationParams,
  ): Promise<{ token: string; session: Session }> {
    const session = await new SessionService().create({
      title: requestBody.title,
      code: requestBody.code,
    });

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

  @Response<ValidateErrorJSON>(422, 'Validation Failed')
  @Response<UnauthorizedErrorJSON>(401, 'Unauthorized')
  @Security('jwt', ['admin'])
  @Put('{sessionId}')
  public async updateSession(
    @Path() sessionId: string,
    @Body() requestBody: SessionUpdateParams,
    @Request() exReq: ExRequest,
  ): Promise<Session> {
    const user = exReq.user;
    if (!user) {
      this.setStatus(401);
      throw new UnauthorizedError({}, 'Unauthorized');
    }

    if (!user.participantId) {
      this.setStatus(401);
      throw new UnauthorizedError({}, 'Unauthorized');
    }

    return await new SessionService().update(sessionId, requestBody);
  }

  @Response<UnauthorizedErrorJSON>(401, 'Unauthorized')
  @Security('jwt', ['admin'])
  @Delete('{sessionId}')
  public async deleteSession(
    @Path() sessionId: string,
    @Request() exReq: ExRequest,
  ): Promise<Session> {
    const user = exReq.user;
    if (!user) {
      this.setStatus(401);
      throw new UnauthorizedError({}, 'Unauthorized');
    }

    if (!user.participantId) {
      this.setStatus(401);
      throw new UnauthorizedError({}, 'Unauthorized');
    }

    return await new SessionService().delete(sessionId);
  }
}
