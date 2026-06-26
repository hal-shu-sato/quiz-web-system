'use client';

import { io, type Socket } from 'socket.io-client';

import URL from './socketURL';

import type {
  AdminClientToServerEvents,
  AdminServerToClientEvents,
} from '../../../server/src/sockets/events';

function createAdminSocket() {
  return io(`${URL}/admin`, {
    extraHeaders: {
      authorization: `bearer ${localStorage.getItem('token') ?? ''}`,
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
    authorization: `bearer ${localStorage.getItem('token') ?? ''}`,
  };
  adminSocket.connect();
}

export default adminSocket;
