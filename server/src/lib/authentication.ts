import type { Request } from 'express';

export function expressAuthentication(
  request: Request,
  securityName: string,
): Promise<any> {
  if (securityName === 'session_auth') {
    if (request.session.participantId) {
      return Promise.resolve({
        participantId: request.session.participantId,
        sessionId: request.session.sessionId,
        isAdmin: request.session.isAdmin,
      });
    }

    return Promise.reject(new Error('Unauthorized'));
  }

  return Promise.reject(
    new Error(
      'No authentication handler configured for security scheme ' +
        securityName,
    ),
  );
}
