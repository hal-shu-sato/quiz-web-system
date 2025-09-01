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
  SessionService,
  type SessionCreationParams,
  type SessionUpdateParams,
} from '../../services/session';

import type { Session } from '../../../generated/prisma';
import type {
  ForbiddenErrorJson,
  UnauthorizedErrorJSON,
  ValidateErrorJSON,
} from '../../lib/errors';
import type { Request as ExRequest } from 'express';

@Route('sessions')
export class SessionsController extends Controller {
  @Get('{sessionId}')
  public async getSession(@Path() sessionId: string): Promise<Session | null> {
    return await new SessionService().getById(sessionId);
  }

  @Security('session_auth')
  @Response<ValidateErrorJSON>(422, 'Validation Failed')
  @Response<UnauthorizedErrorJSON>(401, 'Unauthorized')
  @Response<ForbiddenErrorJson>(403, 'Forbidden')
  @Post()
  public async createSession(
    @Body() requestBody: SessionCreationParams,
    @Request() exReq: ExRequest,
  ): Promise<Session> {
    if (!exReq.session.participantId) {
      this.setStatus(401);
      throw new Error('Unauthorized');
    }

    if (!exReq.session.isAdmin) {
      this.setStatus(403);
      throw new Error('Only admin can create session');
    }

    return await new SessionService().create({
      title: requestBody.title,
      code: requestBody.code,
      startAt: requestBody.startAt,
      endAt: requestBody.endAt,
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
      throw new Error('Unauthorized');
    }

    if (!exReq.session.isAdmin) {
      this.setStatus(403);
      throw new Error('Only admin can create session');
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
      throw new Error('Unauthorized');
    }

    if (!exReq.session.isAdmin) {
      this.setStatus(403);
      throw new Error('Only admin can delete session');
    }

    return await new SessionService().delete(sessionId);
  }
}
