import prisma from '../lib/prisma';
import {
  mapPrismaJudgmentToSocket,
  mapPrismaQuestionTypeToSocket,
  mapPrismaStateToSocketState,
} from '../util/enum';

import type { AnswerWithJudge, Participant, Question } from '../sockets/events';

const DEFAULT_QUESTION: Question = {
  id: '',
  title: '問題未設定',
  max_points: 0,
  type: 'normal',
};

export class SocketDataService {
  public async getQuestion(sessionId: string): Promise<Question> {
    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      include: { currentQuestion: true },
    });

    if (!session?.currentQuestion) {
      return DEFAULT_QUESTION;
    }

    return {
      id: session.currentQuestion.id,
      title: session.currentQuestion.title,
      max_points: session.currentQuestion.maxPoints,
      type: mapPrismaQuestionTypeToSocket(session.currentQuestion.type),
    };
  }

  public async getParticipants(sessionId: string): Promise<Participant[]> {
    const session = await prisma.session.findUnique({
      where: { id: sessionId },
    });

    const participants = await prisma.participant.findMany({
      where: { sessionId },
      orderBy: { name: 'asc' },
    });

    const answerOrderMap = new Map<string, number>();
    if (session?.currentQuestionId) {
      const answers = await prisma.answer.findMany({
        where: { questionId: session.currentQuestionId },
        orderBy: { timestamp: 'asc' },
      });

      answers.forEach((answer, index) => {
        answerOrderMap.set(answer.participantId, index + 1);
      });
    }

    return participants.map((participant) => ({
      id: participant.id,
      name: participant.name,
      score: participant.score,
      is_dobon: participant.isDobon,
      answer_order: answerOrderMap.get(participant.id) ?? 0,
    }));
  }

  public async getAnswers(sessionId: string): Promise<AnswerWithJudge[]> {
    const session = await prisma.session.findUnique({
      where: { id: sessionId },
    });

    if (!session?.currentQuestionId) {
      return [];
    }

    const answers = await prisma.answer.findMany({
      where: { questionId: session.currentQuestionId },
      include: { participant: true },
      orderBy: { timestamp: 'asc' },
    });

    return answers.map((answer) => this.toAnswerWithJudge(answer));
  }

  public async getSessionState(sessionId: string) {
    const session = await prisma.session.findUnique({
      where: { id: sessionId },
    });

    if (!session) {
      return null;
    }

    return mapPrismaStateToSocketState(session.state);
  }

  public toAnswerWithJudge(answer: {
    id: string;
    participantId: string;
    questionId: string;
    answerType: 'TEXT' | 'IMAGE';
    answerText: string | null;
    answerImagePath: string | null;
    judgmentResult: 'PENDING' | 'CORRECT' | 'PARTIAL' | 'INCORRECT' | 'DOBON';
    awardedPoints: number;
    participant: { name: string };
  }): AnswerWithJudge {
    const base = {
      id: answer.id,
      participant_id: answer.participantId,
      participant_name: answer.participant.name,
      question_id: answer.questionId,
      judgment_result: mapPrismaJudgmentToSocket(answer.judgmentResult),
      awarded_points: answer.awardedPoints,
    };

    if (answer.answerType === 'IMAGE' && answer.answerImagePath) {
      return {
        ...base,
        answer_image_url: `/files/${answer.answerImagePath}`,
      };
    }

    return {
      ...base,
      answer_text: answer.answerText ?? '',
    };
  }
}
