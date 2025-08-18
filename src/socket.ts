'use client';

import { io } from 'socket.io-client';

const URL =
  process.env.NODE_ENV === 'production'
    ? process.env.SOCKET_SERVER_URL
    : 'http://localhost:4000';

export const socket = io(URL);
