'use client';

import { io, type Socket } from 'socket.io-client';

import type {
  AdminClientToServerEvents,
  AdminServerToClientEvents,
  ClientToServerEvents,
  ServerToClientEvents,
} from '../../server/src/sockets/events';

const URL =
  process.env.NODE_ENV === 'production'
    ? process.env.NEXT_PUBLIC_SOCKET_SERVER_URL
    : 'ws://localhost:4000';

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  URL,
  { withCredentials: true },
);
export const adminSocket: Socket<
  AdminServerToClientEvents,
  AdminClientToServerEvents
> = io(URL + '/admin', { withCredentials: true });
