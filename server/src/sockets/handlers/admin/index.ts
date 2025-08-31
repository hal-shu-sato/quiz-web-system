import type { Namespace, Server, Socket } from 'socket.io';
import type {
  AdminClientToServerEvents,
  AdminServerToClientEvents,
  ClientToServerEvents,
  ServerToClientEvents,
} from '../../events';

export function registerHandlers(
  io: Server<ClientToServerEvents, ServerToClientEvents>,
  namespace: Namespace<AdminClientToServerEvents, AdminServerToClientEvents>,
  socket: Socket<AdminClientToServerEvents, AdminServerToClientEvents>,
) {
  socket.on('state:update', (state) => {
    console.log('Admin changed state:', state);
    io.emit('state:updated', state);
    namespace.emit('state:updated', state);
  });

  socket.on('screen:update', (screen) => {
    console.log('Admin updated screen:', screen);
    namespace.emit('screen:updated', screen);
  });
}
