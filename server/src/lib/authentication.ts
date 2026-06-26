import * as jwt from 'jsonwebtoken';

import config from '../config';

import { UnauthorizedError } from './errors';

import type { Request } from 'express';

type JwtPayload = {
  data: Express.User;
};

function extractToken(request: Request): string | undefined {
  const authHeader = request.headers.authorization;
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.slice(7);
  }

  if (typeof authHeader === 'string') {
    return authHeader;
  }

  const bodyToken = request.body?.token;
  if (typeof bodyToken === 'string') {
    return bodyToken;
  }

  const queryToken = request.query?.token;
  if (typeof queryToken === 'string') {
    return queryToken;
  }

  const headerToken = request.headers['x-access-token'];
  if (typeof headerToken === 'string') {
    return headerToken;
  }

  return undefined;
}

export function expressAuthentication(
  request: Request,
  securityName: string,
  scopes?: string[],
): Promise<Express.User> {
  if (securityName === 'jwt') {
    const token = extractToken(request);

    return new Promise((resolve, reject) => {
      if (!token) {
        reject(new Error('No token provided'));
        return;
      }

      jwt.verify(
        token,
        config.jwtSecret,
        {
          issuer: config.jwtIssuer,
          audience: config.jwtAudience,
        },
        (err: jwt.VerifyErrors | null, decoded?: string | jwt.JwtPayload) => {
          if (err) {
            reject(err);
            return;
          }

          if (!decoded || typeof decoded === 'string') {
            reject(new Error('Invalid token'));
            return;
          }

          const payload = decoded as JwtPayload;
          const user = payload.data;

          if (!user?.sessionId || !user?.participantId || !user?.scope) {
            reject(new Error('Invalid token payload'));
            return;
          }

          if (scopes) {
            for (const requiredScope of scopes) {
              if (user.scope !== requiredScope) {
                reject(new Error('JWT does not contain required scope.'));
                return;
              }
            }
          }

          resolve(user);
        },
      );
    });
  }

  return Promise.reject(
    new UnauthorizedError(
      {},
      'No authentication handler configured for security scheme ' +
        securityName,
    ),
  );
}
