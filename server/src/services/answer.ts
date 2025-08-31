import type { Answer } from '../generated/prisma';
import prisma from '../lib/prisma';

export class AnswerService {
  create(data: Omit<Answer, 'id' | 'timestamp'>) {
    return prisma.answer.create({
      data,
    });
  }

  getById(id: string) {
    return prisma.answer.findUnique({
      where: { id },
    });
  }

  listByParticipantId(participantId: string) {
    return prisma.answer.findMany({
      where: { participantId },
    });
  }

  listByQuestionId(questionId: string) {
    return prisma.answer.findMany({
      where: { questionId },
    });
  }

  update(id: string, data: Partial<Answer>) {
    return prisma.answer.update({
      where: { id },
      data,
    });
  }

  delete(id: string) {
    return prisma.answer.delete({
      where: { id },
    });
  }

  list() {
    return prisma.answer.findMany();
  }
}
