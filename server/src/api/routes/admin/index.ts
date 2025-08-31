import { Request, Router } from 'express';
import type { AnswerType, JudgmentResult } from '../../../generated/prisma';
import { AnswerService } from '../../../services/answer';
import { ParticipantService } from '../../../services/participant';
import { QuestionService } from '../../../services/question';
import { SessionService } from '../../../services/session';

const router = Router();

// Session CRUD
router.post(
  '/sessions',
  async (
    req: Request<
      unknown,
      unknown,
      {
        title: string;
        code: string;
        startAt?: string;
        endAt?: string;
      }
    >,
    res,
  ) => {
    const { title, code, startAt, endAt } = req.body;
    const session = await new SessionService().create({
      title,
      code,
      startAt: startAt ? new Date(startAt) : null,
      endAt: endAt ? new Date(endAt) : null,
    });
    res.json(session);
  },
);
router.get('/sessions/:id', async (req, res) => {
  const session = await new SessionService().getById(req.params.id);
  res.json(session);
});
router.put(
  '/sessions/:id',
  async (
    req: Request<
      { id: string },
      unknown,
      {
        title?: string;
        code?: string;
        startAt?: string;
        endAt?: string;
      }
    >,
    res,
  ) => {
    const { title, code, startAt, endAt } = req.body;
    const session = await new SessionService().update(req.params.id, {
      title,
      code,
      startAt: startAt ? new Date(startAt) : undefined,
      endAt: endAt ? new Date(endAt) : undefined,
    });
    res.json(session);
  },
);
router.delete('/sessions/:id', async (req, res) => {
  const session = await new SessionService().delete(req.params.id);
  res.json(session);
});

// Participant CRUD
router.post(
  '/participants',
  async (
    req: Request<
      unknown,
      unknown,
      { sessionId: string; name: string; reconnectionCode: string }
    >,
    res,
  ) => {
    const { sessionId, name, reconnectionCode } = req.body;
    const participant = await new ParticipantService().create({
      name,
      sessionId,
      reconnectionCode,
    });
    res.json(participant);
  },
);
router.get('/participants/:id', async (req, res) => {
  const participant = await new ParticipantService().getById(req.params.id);
  res.json(participant);
});
router.put(
  '/participants/:id',
  async (
    req: Request<
      { id: string },
      unknown,
      {
        name?: string;
        reconnectionCode?: string;
        score?: number;
        isDobon?: boolean;
      }
    >,
    res,
  ) => {
    const participant = await new ParticipantService().update(
      req.params.id,
      req.body,
    );
    res.json(participant);
  },
);
router.delete('/participants/:id', async (req, res) => {
  const participant = await new ParticipantService().delete(req.params.id);
  res.json(participant);
});

// Question CRUD
router.post(
  '/questions',
  async (
    req: Request<
      unknown,
      unknown,
      { sessionId: string; title: string; maxPoints: number }
    >,
    res,
  ) => {
    const { sessionId, title, maxPoints } = req.body;
    const question = await new QuestionService().create({
      sessionId,
      title,
      maxPoints,
    });
    res.json(question);
  },
);
router.get('/questions/:id', async (req, res) => {
  const question = await new QuestionService().getById(req.params.id);
  res.json(question);
});
router.put(
  '/questions/:id',
  async (
    req: Request<
      { id: string },
      unknown,
      {
        title?: string;
        maxPoints?: number;
      }
    >,
    res,
  ) => {
    const question = await new QuestionService().update(
      req.params.id,
      req.body,
    );
    res.json(question);
  },
);
router.delete('/questions/:id', async (req, res) => {
  const question = await new QuestionService().delete(req.params.id);
  res.json(question);
});

// Answer CRUD
router.post(
  '/answers',
  async (
    req: Request<
      unknown,
      unknown,
      {
        participantId: string;
        questionId: string;
        answerType: AnswerType;
        answerText: string | null;
        answerImagePath: string | null;
        judgmentResult: JudgmentResult;
        awardedPoints: number;
      }
    >,
    res,
  ) => {
    const answer = await new AnswerService().create(req.body);
    res.json(answer);
  },
);
router.get('/answers/:id', async (req, res) => {
  const answer = await new AnswerService().getById(req.params.id);
  res.json(answer);
});
router.put(
  '/answers/:id',
  async (
    req: Request<
      { id: string },
      unknown,
      {
        answerType?: AnswerType;
        answerText?: string | null;
        answerImagePath?: string | null;
        judgmentResult?: JudgmentResult;
        awardedPoints?: number;
      }
    >,
    res,
  ) => {
    const answer = await new AnswerService().update(req.params.id, req.body);
    res.json(answer);
  },
);
router.delete('/answers/:id', async (req, res) => {
  const answer = await new AnswerService().delete(req.params.id);
  res.json(answer);
});

export default router;
