import { SessionService } from '../services/session';
import { SocketDataService } from '../services/socketData';
import { mapPrismaScreenToSocket } from '../util/enum';

import type {
  AdminClientToServerEvents,
  AdminServerToClientEvents,
  ClientToServerEvents,
  ServerToClientEvents,
  SessionState,
} from './events';
import type { Namespace, Server } from 'socket.io';

function shouldRevealAnswersToParticipants(state: SessionState | null) {
  return state === 'answer_check' || state === 'judge_check';
}

async function getScreenStateForSession(sessionId: string) {
  const session = await new SessionService().getById(sessionId);
  if (!session) {
    return 'linked' as const;
  }

  return mapPrismaScreenToSocket(session.screenState);
}

export async function broadcastSessionState(
  io: Server<ClientToServerEvents, ServerToClientEvents>,
  adminNamespace: Namespace<
    AdminClientToServerEvents,
    AdminServerToClientEvents
  >,
  sessionId: string,
) {
  const socketData = new SocketDataService();
  const state = await socketData.getSessionState(sessionId);

  if (!state) {
    return;
  }

  io.to(sessionId).emit('state:updated', state);
  adminNamespace.to(sessionId).emit('state:updated', state);

  if (shouldRevealAnswersToParticipants(state)) {
    const answers = await socketData.getAnswers(sessionId);
    io.to(sessionId).emit('answers:updated', answers);
    adminNamespace.to(sessionId).emit('answers:updated', answers);
  }
}

export async function broadcastScreenState(
  adminNamespace: Namespace<
    AdminClientToServerEvents,
    AdminServerToClientEvents
  >,
  sessionId: string,
) {
  const screen = await getScreenStateForSession(sessionId);
  adminNamespace.to(sessionId).emit('screen:updated', screen);
}

export async function broadcastParticipants(
  io: Server<ClientToServerEvents, ServerToClientEvents>,
  adminNamespace: Namespace<
    AdminClientToServerEvents,
    AdminServerToClientEvents
  >,
  sessionId: string,
) {
  const participants = await new SocketDataService().getParticipants(sessionId);
  adminNamespace.to(sessionId).emit('participants:updated', participants);
  io.to(sessionId).emit('participants:updated', participants);
}

export async function broadcastQuestion(
  io: Server<ClientToServerEvents, ServerToClientEvents>,
  adminNamespace: Namespace<
    AdminClientToServerEvents,
    AdminServerToClientEvents
  >,
  sessionId: string,
) {
  const question = await new SocketDataService().getQuestion(sessionId);
  io.to(sessionId).emit('question:updated', question);
  adminNamespace.to(sessionId).emit('question:updated', question);
}

export async function broadcastAnswers(
  io: Server<ClientToServerEvents, ServerToClientEvents>,
  adminNamespace: Namespace<
    AdminClientToServerEvents,
    AdminServerToClientEvents
  >,
  sessionId: string,
) {
  const socketData = new SocketDataService();
  const answers = await socketData.getAnswers(sessionId);
  const state = await socketData.getSessionState(sessionId);

  adminNamespace.to(sessionId).emit('answers:updated', answers);

  if (shouldRevealAnswersToParticipants(state)) {
    io.to(sessionId).emit('answers:updated', answers);
  }
}

export async function broadcastAdminSnapshot(
  io: Server<ClientToServerEvents, ServerToClientEvents>,
  adminNamespace: Namespace<
    AdminClientToServerEvents,
    AdminServerToClientEvents
  >,
  sessionId: string,
) {
  const socketData = new SocketDataService();
  const state = await socketData.getSessionState(sessionId);

  if (!state) {
    return;
  }

  const [participants, question, answers, screen] = await Promise.all([
    socketData.getParticipants(sessionId),
    socketData.getQuestion(sessionId),
    socketData.getAnswers(sessionId),
    getScreenStateForSession(sessionId),
  ]);

  const room = adminNamespace.to(sessionId);
  room.emit('state:updated', state);
  room.emit('screen:updated', screen);
  room.emit('participants:updated', participants);
  room.emit('question:updated', question);
  room.emit('answers:updated', answers);
  io.to(sessionId).emit('state:updated', state);
  io.to(sessionId).emit('question:updated', question);
  io.to(sessionId).emit('participants:updated', participants);

  if (shouldRevealAnswersToParticipants(state)) {
    io.to(sessionId).emit('answers:updated', answers);
  }
}
