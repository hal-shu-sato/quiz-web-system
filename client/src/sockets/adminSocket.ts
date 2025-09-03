'use client';

import { io, type Socket } from 'socket.io-client';

import URL from './socketURL';

import type {
  AdminClientToServerEvents,
  AdminServerToClientEvents,
} from '../../../server/src/sockets/events';

const token = localStorage.getItem('token');

const adminSocket: Socket<
  AdminServerToClientEvents,
  AdminClientToServerEvents
> = io(URL + '/admin', {
  extraHeaders: {
    authorization: `bearer ${token}`,
  },
});

export default adminSocket;
