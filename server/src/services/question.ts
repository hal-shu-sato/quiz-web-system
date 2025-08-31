import e from 'express';
import type { Question } from '../generated/prisma';
import prisma from '../lib/prisma';

export type QuestionCreationParams = Pick<
  Question,
  'sessionId' | 'title' | 'maxPoints'
>;
export type QuestionUpdateParams = Partial<Question>;

export class QuestionService {
  public create(data: QuestionCreationParams) {
    return prisma.question.create({
      data: {
        sessionId: data.sessionId,
        title: data.title,
        maxPoints: data.maxPoints,
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

  public update(id: string, data: QuestionUpdateParams) {
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
