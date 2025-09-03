'use client';

import { io, type Socket } from 'socket.io-client';

import URL from './socketURL';

import type {
  ClientToServerEvents,
  ServerToClientEvents,
} from '../../../server/src/sockets/events';

const token = localStorage.getItem('token');

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(URL, {
  extraHeaders: {
    authorization: `bearer ${token}`,
  },
});

export default socket;
