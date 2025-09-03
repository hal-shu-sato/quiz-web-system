import passport from 'passport';
import { type Namespace, Server } from 'socket.io';

import { corsOptions } from '../lib/cors';
import { SessionService } from '../services/session';
import { mapPrismaStateToSocketState } from '../util/enum';

import { registerAdminHandlers, registerMainHandlers } from './handlers';

import type {
  AdminClientToServerEvents,
  AdminServerToClientEvents,
  ClientToServerEvents,
  ServerToClientEvents,
} from './events';
import type { NextFunction, Response, Request } from 'express';
import type { Server as HttpServer } from 'http';

export function initializeSocket(httpServer: HttpServer) {
  const io = new Server<ClientToServerEvents, ServerToClientEvents>(
    httpServer,
    {
      cors: corsOptions,
    },
  );

  io.engine.use(
    (
      req: Request & { _query: { sid?: string } },
      res: Response,
      next: NextFunction,
    ) => {
      const isHandshake = req._query.sid === undefined;
      if (isHandshake) {
        passport.authenticate('jwt', { session: false })(req, res, next);
      } else {
        next();
      }
    },
  );

  io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    registerMainHandlers(io, socket);

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });

    const req = socket.request as Request;
    const user = req.user;
    if (!user) {
      console.error('No user found in request for socket:', socket.id);
      socket.disconnect();
      return;
    }

    const sessionId = user.sessionId;
    if (!sessionId) {
      console.error('No session ID found in session for socket:', socket.id);
      socket.disconnect();
      return;
    }

    void socket.join(sessionId);

    const session = new SessionService().getById(sessionId);
    void session.then((s) => {
      if (!s) {
        console.error('Session not found for ID:', sessionId);
        socket.disconnect();
        return;
      }

      socket.emit('state:updated', mapPrismaStateToSocketState(s.state));
    });
  });

  const adminNamespace: Namespace<
    AdminClientToServerEvents,
    AdminServerToClientEvents
  > = io.of('/admin');

  adminNamespace.on('connection', (socket) => {
    console.log('Admin connected:', socket.id);

    registerAdminHandlers(io, adminNamespace, socket);

    socket.on('disconnect', () => {
      console.log('Admin disconnected:', socket.id);
    });

    const req = socket.request as Request;
    const user = req.user;
    if (!user) {
      console.error('No user found in request for admin socket:', socket.id);
      socket.disconnect();
      return;
    }

    const sessionId = user.sessionId;
    if (!sessionId) {
      console.error(
        'No session ID found in session for admin socket:',
        socket.id,
      );
      socket.disconnect();
      return;
    }

    void socket.join(sessionId);

    const session = new SessionService().getById(sessionId);
    void session.then((s) => {
      if (!s) {
        console.error('Session not found for ID:', sessionId);
        socket.disconnect();
        return;
      }

      socket.emit('state:updated', mapPrismaStateToSocketState(s.state));
    });
  });
}
