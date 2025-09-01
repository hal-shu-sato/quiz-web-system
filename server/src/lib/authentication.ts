import { UnauthorizedError } from './errors';

import type { Request } from 'express';

export function expressAuthentication(
  request: Request,
  securityName: string,
): Promise<{ participantId: string; sessionId?: string; isAdmin?: boolean }> {
  if (securityName === 'session_auth') {
    if (request.session.participantId) {
      return Promise.resolve({
        participantId: request.session.participantId,
        sessionId: request.session.sessionId,
        isAdmin: request.session.isAdmin,
      });
    }

    return Promise.reject(new UnauthorizedError({}, 'Unauthorized'));
  }

  return Promise.reject(
    new UnauthorizedError(
      {},
      'No authentication handler configured for security scheme ' +
        securityName,
    ),
  );
}
