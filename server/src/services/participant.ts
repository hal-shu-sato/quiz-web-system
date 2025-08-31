import type { Participant } from '../generated/prisma';
import prisma from '../lib/prisma';

export type ParticipantCreationParams = Pick<
  Participant,
  'name' | 'sessionId' | 'reconnectionCode'
>;

export class ParticipantService {
  create(data: ParticipantCreationParams) {
    return prisma.participant.create({
      data: {
        name: data.name,
        sessionId: data.sessionId,
        score: 0,
        isDobon: false,
        reconnectionCode: data.reconnectionCode,
      },
    });
  }

  getById(id: string) {
    return prisma.participant.findUnique({
      where: { id },
    });
  }

  listBySessionId(sessionId: string) {
    return prisma.participant.findMany({
      where: { sessionId },
    });
  }

  getByReconnectionCode(sessionId: string, reconnectionCode: string) {
    return prisma.participant.findUnique({
      where: {
        sessionId_reconnectionCode: {
          sessionId,
          reconnectionCode,
        },
      },
    });
  }

  update(id: string, data: Partial<Participant>) {
    return prisma.participant.update({
      where: { id },
      data,
    });
  }

  delete(id: string) {
    return prisma.participant.delete({
      where: { id },
    });
  }

  list() {
    return prisma.participant.findMany();
  }
}
