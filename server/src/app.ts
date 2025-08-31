import cors from 'cors';
import express from 'express';
import session from 'express-session';
import swaggerUi from 'swagger-ui-express';
import { ValidateError } from 'tsoa';

import { RegisterRoutes } from './build/routes';
import config from './config';
import sessionMiddleware from './lib/session';

import type {
  Request as ExRequest,
  Response as ExResponse,
  NextFunction,
} from 'express';

declare module 'express-session' {
  interface SessionData {
    participantId: string;
    isAdmin: boolean;
  }
}

const app = express();

app.use(
  cors({
    origin: config.corsOrigin,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/files', express.static('files'));
app.use('/docs', swaggerUi.serve, async (_req: ExRequest, res: ExResponse) => {
  return res.send(
    swaggerUi.generateHTML(await import('../build/openapi.json')),
  );
});

app.use(sessionMiddleware);

RegisterRoutes(app);

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
  if (err instanceof Error) {
    return res.status(500).json({
      message: 'Internal Server Error',
    });
  }

  next();
});

export default app;
