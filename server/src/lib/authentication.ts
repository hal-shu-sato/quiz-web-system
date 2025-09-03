import * as jwt from 'jsonwebtoken';

import config from '../config';

import { UnauthorizedError } from './errors';

import type { Request } from 'express';

export function expressAuthentication(
  request: Request,
  securityName: string,
  scopes?: string[],
): Promise<Express.User> {
  if (securityName === 'jwt') {
    const token =
      request.body.token ||
      request.query.token ||
      request.headers['x-access-token'];

    return new Promise((resolve, reject) => {
      if (!token) {
        reject(new Error('No token provided'));
      }
      jwt.verify(
        token,
        config.jwtSecret,
        (err: jwt.VerifyErrors | null, decoded?: string | jwt.JwtPayload) => {
          if (err) {
            reject(err);
          } else {
            if (!decoded || typeof decoded === 'string') {
              reject(new Error('Invalid token'));
              return;
            }

            const { scope, sessionId, participantId } = decoded;

            if (scopes) {
              // Check if JWT contains all required scopes
              for (const scope of scopes) {
                if (!decoded.scopes.includes(scope)) {
                  reject(new Error('JWT does not contain required scope.'));
                }
              }
            }

            resolve({ scope, sessionId, participantId });
          }
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
