'use client';

import { io, type Socket } from 'socket.io-client';

import URL from './socketURL';

import type {
  ClientToServerEvents,
  ServerToClientEvents,
} from '../../../server/src/sockets/events';

function createSocket() {
  return io(URL, {
    extraHeaders: {
      authorization: `bearer ${localStorage.getItem('token') ?? ''}`,
    },
  });
}

const socket: Socket<ServerToClientEvents, ClientToServerEvents> =
  createSocket();

export function reconnectSocket() {
  socket.disconnect();
  socket.io.opts.extraHeaders = {
    authorization: `bearer ${localStorage.getItem('token') ?? ''}`,
  };
  socket.connect();
}

export default socket;
