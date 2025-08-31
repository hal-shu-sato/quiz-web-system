import type { Participant } from '../generated/prisma';
import prisma from '../lib/prisma';

export type ParticipantCreationParams = Pick<
  Participant,
  'name' | 'sessionId' | 'reconnectionCode'
>;
export type ParticipantUpdateParams = Partial<Participant>;

export class ParticipantService {
  public create(data: ParticipantCreationParams) {
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

  public getById(id: string) {
    return prisma.participant.findUnique({
      where: { id },
    });
  }

  public listBySessionId(sessionId: string) {
    return prisma.participant.findMany({
      where: { sessionId },
    });
  }

  public getByReconnectionCode(sessionId: string, reconnectionCode: string) {
    return prisma.participant.findUnique({
      where: {
        sessionId_reconnectionCode: {
          sessionId,
          reconnectionCode,
        },
      },
    });
  }

  public update(id: string, data: ParticipantUpdateParams) {
    return prisma.participant.update({
      where: { id },
      data,
    });
  }

  public delete(id: string) {
    return prisma.participant.delete({
      where: { id },
    });
  }

  public list() {
    return prisma.participant.findMany();
  }
}
