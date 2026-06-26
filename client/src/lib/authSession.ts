import { reconnectAdminSocket } from '@/sockets/adminSocket';
import { reconnectSocket as reconnectParticipantSocket } from '@/sockets/socket';

export function persistAuthSession({
  token,
  participantId,
}: {
  token: string;
  participantId?: string;
}) {
  localStorage.setItem('token', token);
  if (participantId) {
    localStorage.setItem('participantId', participantId);
  }
}

export function reconnectSockets(scope: 'admin' | 'participant') {
  if (scope === 'admin') {
    reconnectAdminSocket();
    return;
  }

  reconnectParticipantSocket();
}
