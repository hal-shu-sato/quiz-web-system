import prisma from '../../../lib/prisma';
import { deleteImageFile, saveBase64Image } from '../../../lib/image';
import { AnswerService } from '../../../services/answer';
import { SessionService } from '../../../services/session';
import { SocketDataService } from '../../../services/socketData';
import { broadcastAnswers, broadcastParticipants } from '../../broadcast';

import type {
  AdminClientToServerEvents,
  AdminServerToClientEvents,
  ClientToServerEvents,
  ServerToClientEvents,
} from '../../events';
import type { Namespace, Server, Socket } from 'socket.io';
import type { Request } from 'express';

export function registerHandlers(
  _io: Server<ClientToServerEvents, ServerToClientEvents>,
  adminNamespace: Namespace<
    AdminClientToServerEvents,
    AdminServerToClientEvents
  >,
  socket: Socket<ClientToServerEvents, ServerToClientEvents>,
) {
  const req = socket.request as Request;
  const user = req.user;

  if (
    !user ||
    user.scope !== 'participant' ||
    !user.sessionId ||
    !user.participantId
  ) {
    socket.disconnect();
    return;
  }

  const sessionId = user.sessionId;
  const participantId = user.participantId;

  socket.on('answer:create', (answer) => {
    void (async () => {
      const session = await new SessionService().getById(sessionId);
      if (!session?.currentQuestionId || session.state !== 'ANSWER') {
        return;
      }

      const answerService = new AnswerService();
      const existing = await prisma.answer.findUnique({
        where: {
          participantId_questionId: {
            participantId,
            questionId: session.currentQuestionId,
          },
        },
      });

      let answerImagePath: string | null = null;
      if ('answer_base64' in answer && answer.answer_base64) {
        answerImagePath = await saveBase64Image(answer.answer_base64);
      }

      if (existing) {
        if (existing.answerImagePath && answerImagePath) {
          await deleteImageFile(existing.answerImagePath);
        }

        await answerService.update(existing.id, {
          answerType: answerImagePath ? 'IMAGE' : 'TEXT',
          answerText: 'answer_text' in answer ? answer.answer_text : null,
          answerImagePath: answerImagePath ?? existing.answerImagePath,
          judgmentResult: 'PENDING',
          awardedPoints: 0,
          timestamp: new Date(),
        });
      } else {
        await answerService.create({
          questionId: session.currentQuestionId,
          participantId,
          answerType: answerImagePath ? 'IMAGE' : 'TEXT',
          answerText: 'answer_text' in answer ? answer.answer_text : null,
          answerImagePath,
          judgmentResult: 'PENDING',
          awardedPoints: 0,
        });
      }

      await broadcastAnswers(_io, adminNamespace, sessionId);
      await broadcastParticipants(_io, adminNamespace, sessionId);

      const answers = await new SocketDataService().getAnswers(sessionId);
      const created = answers.find(
        (item) =>
          item.participant_id === participantId &&
          item.question_id === session.currentQuestionId,
      );

      if (created) {
        socket.emit('judge:updated', {
          answer_id: created.id,
          judgment_result: 'pending',
          awarded_points: 0,
        });
      }
    })();
  });
}
