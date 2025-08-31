import type { Question } from '../generated/prisma';
import prisma from '../lib/prisma';

export class QuestionService {
  public create(sessionId: string, title: string, maxPoints: number) {
    return prisma.question.create({
      data: {
        sessionId,
        title,
        maxPoints,
      },
    });
  }

  public getById(id: string) {
    return prisma.question.findUnique({
      where: { id },
    });
  }

  public listBySessionId(sessionId: string) {
    return prisma.question.findMany({
      where: { sessionId },
    });
  }

  public update(id: string, data: Partial<Question>) {
    return prisma.question.update({
      where: { id },
      data,
    });
  }

  public delete(id: string) {
    return prisma.question.delete({
      where: { id },
    });
  }

  public list() {
    return prisma.question.findMany();
  }
}
