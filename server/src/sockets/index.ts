import { type Namespace, Server } from 'socket.io';

import { corsOptions } from '../lib/cors';
import sessionMiddleware from '../lib/session';
import { SessionService } from '../services/session';
import { mapPrismaStateToSocketState } from '../util/enum';

import { registerAdminHandlers, registerMainHandlers } from './handlers';

import type {
  AdminClientToServerEvents,
  AdminServerToClientEvents,
  ClientToServerEvents,
  ServerToClientEvents,
} from './events';
import type { Request } from 'express';
import type { Server as HttpServer } from 'http';

export function initializeSocket(httpServer: HttpServer) {
  const io = new Server<ClientToServerEvents, ServerToClientEvents>(
    httpServer,
    {
      cors: corsOptions,
    },
  );

  io.engine.use(sessionMiddleware);

  io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    registerMainHandlers(io, socket);

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });

    const req = socket.request as Request;
    const sessionId = req.session.sessionId;
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
    const sessionId = req.session.sessionId;
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
