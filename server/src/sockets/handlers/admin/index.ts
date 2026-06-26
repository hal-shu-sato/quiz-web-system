import {
  broadcastAnswers,
  broadcastParticipants,
  broadcastQuestion,
  broadcastSessionState,
} from '../../broadcast';
import { deleteImageFile } from '../../../lib/image';
import { AnswerService } from '../../../services/answer';
import { ParticipantService } from '../../../services/participant';
import { QuestionService } from '../../../services/question';
import { SessionService } from '../../../services/session';
import {
  mapPrismaJudgmentToSocket,
  mapSocketJudgmentToPrisma,
  mapSocketStateToPrismaState,
  setScreenState,
} from '../../../util/enum';

import type {
  AdminClientToServerEvents,
  AdminServerToClientEvents,
  ClientToServerEvents,
  ServerToClientEvents,
} from '../../events';
import type { Namespace, Server, Socket } from 'socket.io';
import type { Request } from 'express';

export function registerHandlers(
  io: Server<ClientToServerEvents, ServerToClientEvents>,
  namespace: Namespace<AdminClientToServerEvents, AdminServerToClientEvents>,
  socket: Socket<AdminClientToServerEvents, AdminServerToClientEvents>,
) {
  const req = socket.request as Request;
  const user = req.user;

  if (!user || user.scope !== 'admin' || !user.sessionId) {
    socket.disconnect();
    return;
  }

  const sessionId = user.sessionId;

  socket.on('state:update', (state) => {
    void (async () => {
      await new SessionService().update(sessionId, {
        state: mapSocketStateToPrismaState(state),
      });
      await broadcastSessionState(io, namespace, sessionId);
    })();
  });

  socket.on('screen:update', (screen) => {
    setScreenState(sessionId, screen);
    namespace.to(sessionId).emit('screen:updated', screen);
  });

  socket.on('question:create', (question) => {
    void (async () => {
      const created = await new QuestionService().create({
        sessionId,
        title: question.title,
        maxPoints: question.max_points,
      });

      await new SessionService().update(sessionId, {
        currentQuestionId: created.id,
      });

      await broadcastQuestion(io, namespace, sessionId);
      await broadcastAnswers(io, namespace, sessionId);
    })();
  });

  socket.on('question:update', (id, question) => {
    void (async () => {
      if (id) {
        await new QuestionService().update(id, {
          title: question.title,
          maxPoints: question.max_points,
        });
      } else {
        const created = await new QuestionService().create({
          sessionId,
          title: question.title,
          maxPoints: question.max_points,
        });
        await new SessionService().update(sessionId, {
          currentQuestionId: created.id,
        });
      }

      await broadcastQuestion(io, namespace, sessionId);
    })();
  });

  socket.on('judge:update', (answerId, judge) => {
    void (async () => {
      const answerService = new AnswerService();
      const participantService = new ParticipantService();
      const existing = await answerService.getById(answerId);

      if (!existing) {
        return;
      }

      const participant = await participantService.getById(
        existing.participantId,
      );
      if (!participant) {
        return;
      }

      const nextScore =
        participant.score - existing.awardedPoints + judge.awarded_points;

      await answerService.update(answerId, {
        judgmentResult: mapSocketJudgmentToPrisma(judge.judgment_result),
        awardedPoints: judge.awarded_points,
      });

      await participantService.update(participant.id, {
        score: nextScore,
        isDobon: judge.judgment_result === 'dobon',
      });

      const updatedAnswer = await answerService.getById(answerId);
      if (updatedAnswer) {
        io.to(sessionId).emit('judge:updated', {
          answer_id: updatedAnswer.id,
          judgment_result: mapPrismaJudgmentToSocket(
            updatedAnswer.judgmentResult,
          ),
          awarded_points: updatedAnswer.awardedPoints,
        });
      }

      await broadcastAnswers(io, namespace, sessionId);
      await broadcastParticipants(namespace, sessionId);
    })();
  });

  socket.on('answer:delete', (id) => {
    void (async () => {
      const answer = await new AnswerService().getById(id);
      if (!answer) {
        return;
      }

      const participant = await new ParticipantService().getById(
        answer.participantId,
      );
      if (participant) {
        await new ParticipantService().update(participant.id, {
          score: participant.score - answer.awardedPoints,
        });
      }

      await deleteImageFile(answer.answerImagePath);
      await new AnswerService().delete(id);
      await broadcastAnswers(io, namespace, sessionId);
      await broadcastParticipants(namespace, sessionId);
    })();
  });
}
