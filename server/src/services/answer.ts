import type { Answer } from '../generated/prisma';
import prisma from '../lib/prisma';

export class AnswerService {
  public create(data: Omit<Answer, 'id' | 'timestamp'>) {
    return prisma.answer.create({
      data,
    });
  }

  public getById(id: string) {
    return prisma.answer.findUnique({
      where: { id },
    });
  }

  public listByParticipantId(participantId: string) {
    return prisma.answer.findMany({
      where: { participantId },
    });
  }

  public listByQuestionId(questionId: string) {
    return prisma.answer.findMany({
      where: { questionId },
    });
  }

  public update(id: string, data: Partial<Answer>) {
    return prisma.answer.update({
      where: { id },
      data,
    });
  }

  public delete(id: string) {
    return prisma.answer.delete({
      where: { id },
    });
  }

  public list() {
    return prisma.answer.findMany();
  }
}
