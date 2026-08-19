import passport from 'passport';
import { type Namespace, Server } from 'socket.io';

import { corsOptions } from '../lib/cors';
import { SocketDataService } from '../services/socketData';

import { broadcastAdminSnapshot } from './broadcast';
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

  const adminNamespace: Namespace<
    AdminClientToServerEvents,
    AdminServerToClientEvents
  > = io.of('/admin');

  const authenticateJwt = passport.authenticate('jwt', {
    session: false,
  }) as (req: Request, res: Response, next: NextFunction) => void;

  io.engine.use(
    (
      req: Request & { _query: { sid?: string } },
      res: Response,
      next: NextFunction,
    ) => {
      const isHandshake = req._query.sid === undefined;
      if (isHandshake) {
        authenticateJwt(req, res, next);
      } else {
        next();
      }
    },
  );

  io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

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

    registerMainHandlers(io, adminNamespace, socket);

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });

    void (async () => {
      const socketData = new SocketDataService();
      const state = await socketData.getSessionState(sessionId);
      if (!state) {
        console.error('Session not found for ID:', sessionId);
        socket.disconnect();
        return;
      }

      socket.emit('state:updated', state);
      socket.emit('question:updated', await socketData.getQuestion(sessionId));
      socket.emit(
        'participants:updated',
        await socketData.getParticipants(sessionId),
      );

      if (state === 'answer_check' || state === 'judge_check') {
        socket.emit('answers:updated', await socketData.getAnswers(sessionId));
      }
    })();
  });

  adminNamespace.on('connection', (socket) => {
    console.log('Admin connected:', socket.id);

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

    if (user.scope !== 'admin') {
      console.error('Non-admin user connected to admin namespace:', socket.id);
      socket.disconnect();
      return;
    }

    void socket.join(sessionId);

    registerAdminHandlers(io, adminNamespace, socket);

    socket.on('disconnect', () => {
      console.log('Admin disconnected:', socket.id);
    });

    void broadcastAdminSnapshot(io, adminNamespace, sessionId);
  });
}
