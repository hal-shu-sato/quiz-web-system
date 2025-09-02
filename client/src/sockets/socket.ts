'use client';

import { io, type Socket } from 'socket.io-client';

import URL from './socketURL';

import type {
  ClientToServerEvents,
  ServerToClientEvents,
} from '../../../server/src/sockets/events';

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(URL, {
  withCredentials: true,
});

export default socket;
