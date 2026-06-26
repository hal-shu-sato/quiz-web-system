'use client';

import { useEffect, useState } from 'react';

import { Box, Container, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';

import $api from '@/lib/api';
import socket from '@/sockets/socket';

import { AnswerView, JudgeView, QuestionView, WaitView } from './_components';

import type {
  AnswerWithJudge,
  Question,
} from '../../../../server/src/sockets/events';
import type { SessionStates } from '../admin/[id]/_components/StateChangeButtons';

function getParticipantId() {
  if (typeof window === 'undefined') {
    return undefined;
  }

  return localStorage.getItem('participantId') ?? undefined;
}

export default function QuizPanel({ id }: { id: string }) {
  const [sessionState, setSessionState] = useState<SessionStates>('wait');
  const [question, setQuestion] = useState<Question>({
    id: '',
    title: '問題未設定',
    max_points: 0,
    type: 'normal',
  });
  const [answers, setAnswers] = useState<AnswerWithJudge[]>([]);
  const [participantId, setParticipantId] = useState<string | undefined>();

  const router = useRouter();

  const { data, error, isLoading } = $api.useQuery(
    'get',
    '/sessions/{sessionId}',
    {
      params: {
        path: { sessionId: id },
      },
    },
  );

  useEffect(() => {
    setParticipantId(getParticipantId());
  }, []);

  useEffect(() => {
    function onUpdateState(newState: SessionStates) {
      setSessionState(newState);
    }

    function onUpdateQuestion(nextQuestion: Question) {
      setQuestion(nextQuestion);
    }

    function onUpdateAnswers(nextAnswers: AnswerWithJudge[]) {
      setAnswers(nextAnswers);
    }

    socket.on('state:updated', onUpdateState);
    socket.on('question:updated', onUpdateQuestion);
    socket.on('answers:updated', onUpdateAnswers);

    return () => {
      socket.off('state:updated', onUpdateState);
      socket.off('question:updated', onUpdateQuestion);
      socket.off('answers:updated', onUpdateAnswers);
    };
  }, []);

  if (isLoading) {
    return <Box>Loading...</Box>;
  }

  if (error || !data) {
    router.push('/');
    return <Box>Error loading session. Redirecting to home...</Box>;
  }

  const activeQuestionId = question.id || data.currentQuestionId || '';

  return (
    <Container>
      <Typography component="h1" variant="h4">
        Quiz Panel for {data.title}
      </Typography>
      {sessionState === 'wait' && <WaitView />}
      {sessionState === 'question' && <QuestionView title={question.title} />}
      {sessionState === 'answer' && (
        <AnswerView
          questionId={activeQuestionId}
          participantId={participantId}
        />
      )}
      {(sessionState === 'judge' ||
        sessionState === 'answer_check' ||
        sessionState === 'judge_check') && (
        <JudgeView
          answers={answers}
          showAnswer={
            sessionState === 'answer_check' || sessionState === 'judge_check'
          }
          showJudge={sessionState === 'judge_check'}
        />
      )}
    </Container>
  );
}
