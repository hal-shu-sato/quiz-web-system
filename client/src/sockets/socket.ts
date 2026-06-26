'use client';

import { io, type Socket } from 'socket.io-client';

import URL from './socketURL';

import type {
  ClientToServerEvents,
  ServerToClientEvents,
} from '../../../server/src/sockets/events';

function readToken() {
  if (typeof window === 'undefined') {
    return '';
  }

  return localStorage.getItem('token') ?? '';
}

function createSocket() {
  return io(URL, {
    autoConnect: typeof window !== 'undefined',
    extraHeaders: {
      authorization: `bearer ${readToken()}`,
    },
  });
}

const socket: Socket<ServerToClientEvents, ClientToServerEvents> =
  createSocket();

export function reconnectSocket() {
  socket.disconnect();
  socket.io.opts.extraHeaders = {
    authorization: `bearer ${readToken()}`,
  };
  socket.connect();
}

export default socket;
