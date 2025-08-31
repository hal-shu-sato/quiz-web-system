import type { Question } from '../generated/prisma';
import prisma from '../lib/prisma';

export class QuestionService {
  create(sessionId: string, title: string, maxPoints: number) {
    return prisma.question.create({
      data: {
        sessionId,
        title,
        maxPoints,
      },
    });
  }

  getById(id: string) {
    return prisma.question.findUnique({
      where: { id },
    });
  }

  listBySessionId(sessionId: string) {
    return prisma.question.findMany({
      where: { sessionId },
    });
  }

  update(id: string, data: Partial<Question>) {
    return prisma.question.update({
      where: { id },
      data,
    });
  }

  delete(id: string) {
    return prisma.question.delete({
      where: { id },
    });
  }

  list() {
    return prisma.question.findMany();
  }
}
