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

import {
  ForbiddenError,
  UnauthorizedError,
  type ForbiddenErrorJson,
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
    @Request() exReq: ExRequest,
  ): Promise<Session> {
    exReq.session.isAdmin = true;

    return await new SessionService().create({
      title: requestBody.title,
      code: requestBody.code,
    });
  }

  @Security('session_auth')
  @Response<ValidateErrorJSON>(422, 'Validation Failed')
  @Response<UnauthorizedErrorJSON>(401, 'Unauthorized')
  @Response<ForbiddenErrorJson>(403, 'Forbidden')
  @Put('{sessionId}')
  public async updateSession(
    @Path() sessionId: string,
    @Body() requestBody: SessionUpdateParams,
    @Request() exReq: ExRequest,
  ): Promise<Session> {
    if (!exReq.session.participantId) {
      this.setStatus(401);
      throw new UnauthorizedError({}, 'Unauthorized');
    }

    if (!exReq.session.isAdmin) {
      this.setStatus(403);
      throw new ForbiddenError({}, 'Only admin can update session');
    }

    return await new SessionService().update(sessionId, requestBody);
  }

  @Security('session_auth')
  @Response<UnauthorizedErrorJSON>(401, 'Unauthorized')
  @Response<ForbiddenErrorJson>(403, 'Forbidden')
  @Delete('{sessionId}')
  public async deleteSession(
    @Path() sessionId: string,
    @Request() exReq: ExRequest,
  ): Promise<Session> {
    if (!exReq.session.participantId) {
      this.setStatus(401);
      throw new UnauthorizedError({}, 'Unauthorized');
    }

    if (!exReq.session.isAdmin) {
      this.setStatus(403);
      throw new ForbiddenError({}, 'Only admin can delete session');
    }

    return await new SessionService().delete(sessionId);
  }
}
