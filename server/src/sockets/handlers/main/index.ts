import type { ClientToServerEvents, ServerToClientEvents } from '../../events';
import type { Server, Socket } from 'socket.io';

export function registerHandlers(
  io: Server<ClientToServerEvents, ServerToClientEvents>,
  socket: Socket<ClientToServerEvents, ServerToClientEvents>,
) {
  socket.on('answer:create', (answer) => {
    console.log('Received answer:', answer);
  });
}
