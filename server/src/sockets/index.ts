import { type Namespace, Server } from 'socket.io';

import config from '../config';

import { registerAdminHandlers, registerMainHandlers } from './handlers';

import type {
  AdminClientToServerEvents,
  AdminServerToClientEvents,
  ClientToServerEvents,
  ServerToClientEvents,
} from './events';
import type { Server as HttpServer } from 'http';

export function initializeSocket(httpServer: HttpServer) {
  const io = new Server<ClientToServerEvents, ServerToClientEvents>(
    httpServer,
    {
      cors: {
        origin: config.corsOrigin,
        methods: ['GET', 'POST'],
      },
    },
  );

  io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    registerMainHandlers(io, socket);

    socket.emit('state:updated', 'wait');

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
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
  });
}
