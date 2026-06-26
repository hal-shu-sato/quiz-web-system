'use client';

import { io, type Socket } from 'socket.io-client';

import URL from './socketURL';

import type {
  AdminClientToServerEvents,
  AdminServerToClientEvents,
} from '../../../server/src/sockets/events';

function readToken() {
  if (typeof window === 'undefined') {
    return '';
  }

  return localStorage.getItem('token') ?? '';
}

function createAdminSocket() {
  return io(`${URL}/admin`, {
    autoConnect: typeof window !== 'undefined',
    extraHeaders: {
      authorization: `bearer ${readToken()}`,
    },
  });
}

const adminSocket: Socket<
  AdminServerToClientEvents,
  AdminClientToServerEvents
> = createAdminSocket();

export function reconnectAdminSocket() {
  adminSocket.disconnect();
  adminSocket.io.opts.extraHeaders = {
    authorization: `bearer ${readToken()}`,
  };
  adminSocket.connect();
}

export default adminSocket;
