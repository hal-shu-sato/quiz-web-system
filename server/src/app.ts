import cors from 'cors';
import express from 'express';
import passport from 'passport';
import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt';
import swaggerUi from 'swagger-ui-express';
import { ValidateError } from 'tsoa';

import { RegisterRoutes } from './build/routes';
import config from './config';
import { corsOptions } from './lib/cors';
import { ForbiddenError, NotFoundError, UnauthorizedError } from './lib/errors';

import type {
  Request as ExRequest,
  Response as ExResponse,
  NextFunction,
} from 'express';
import type { StrategyOptionsWithoutRequest } from 'passport-jwt';

declare global {
  namespace Express {
    interface User {
      scope: 'admin' | 'participant';
      sessionId: string;
      participantId: string;
    }
  }
}

const app = express();

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/files', express.static('files'));
app.use('/docs', swaggerUi.serve, async (_req: ExRequest, res: ExResponse) => {
  return res.send(
    swaggerUi.generateHTML(await import('../build/openapi.json')),
  );
});

RegisterRoutes(app);

const jwtDecodeOptions: StrategyOptionsWithoutRequest = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.jwtSecret,
  issuer: config.jwtIssuer,
  audience: config.jwtAudience,
};

passport.use(
  new JwtStrategy(jwtDecodeOptions, (payload: { data: unknown }, done) => {
    return done(null, payload.data);
  }),
);

app.use(function notFoundHandler(_req, res: ExResponse) {
  res.status(404).send({
    message: 'Not Found',
  });
});

app.use(function errorHandler(
  err: unknown,
  req: ExRequest,
  res: ExResponse,
  next: NextFunction,
): ExResponse | void {
  if (err instanceof ValidateError) {
    console.warn(`Caught Validation Error for ${req.path}:`, err.fields);
    return res.status(422).json({
      message: 'Validation Failed',
      details: err?.fields,
    });
  }

  if (err instanceof UnauthorizedError) {
    console.warn(`Caught Unauthorized Error for ${req.path}:`, err.fields);
    return res.status(401).json({
      message: 'Unauthorized',
      details: err?.fields,
    });
  }

  if (err instanceof ForbiddenError) {
    console.warn(`Caught Forbidden Error for ${req.path}:`, err.fields);
    return res.status(403).json({
      message: 'Forbidden',
      details: err?.fields,
    });
  }

  if (err instanceof NotFoundError) {
    console.warn(`Caught Not Found Error for ${req.path}:`, err.fields);
    return res.status(404).json({
      message: 'Not found',
      details: err?.fields,
    });
  }

  if (err instanceof Error) {
    return res.status(500).json({
      message: 'Internal Server Error',
    });
  }

  next();
});

export default app;
