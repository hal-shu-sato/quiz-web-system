import prisma from '../lib/prisma';

import type { Answer } from '../generated/prisma';

export type AnswerCreationParams = Pick<
  Answer,
  | 'questionId'
  | 'participantId'
  | 'answerType'
  | 'answerText'
  | 'answerImagePath'
  | 'awardedPoints'
  | 'judgmentResult'
>;
export type AnswerUpdateParams = Partial<Answer>;

export class AnswerService {
  public create(data: AnswerCreationParams) {
    return prisma.answer.create({
      data: {
        questionId: data.questionId,
        participantId: data.participantId,
        answerType: data.answerType,
        answerText: data.answerText,
        answerImagePath: data.answerImagePath,
        awardedPoints: data.awardedPoints,
        judgmentResult: data.judgmentResult,
      },
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

  public update(id: string, data: AnswerUpdateParams) {
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
