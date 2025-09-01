import {
  Body,
  Controller,
  Delete,
  Get,
  Path,
  Post,
  Put,
  Response,
  Route,
} from 'tsoa';

import {
  SessionService,
  type SessionCreationParams,
  type SessionUpdateParams,
} from '../../services/session';

import type { Session } from '../../../generated/prisma';
import type { ValidateErrorJSON } from '../../types/errors';

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
  ): Promise<Session> {
    return await new SessionService().create({
      title: requestBody.title,
      code: requestBody.code,
      startAt: requestBody.startAt,
      endAt: requestBody.endAt,
    });
  }

  @Response<ValidateErrorJSON>(422, 'Validation Failed')
  @Put('{sessionId}')
  public async updateSession(
    @Path() sessionId: string,
    @Body() requestBody: SessionUpdateParams,
  ): Promise<Session> {
    return await new SessionService().update(sessionId, requestBody);
  }

  @Delete('{sessionId}')
  public async deleteSession(@Path() sessionId: string): Promise<Session> {
    return await new SessionService().delete(sessionId);
  }
}
