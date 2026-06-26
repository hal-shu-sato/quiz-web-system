'use client';

import { useEffect, useState } from 'react';

import { Alert, Container, Grid, Stack, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';

import LoadingView from '@/components/LoadingView';
import ParticipantScoreList from '@/components/ParticipantScoreList';
import $api from '@/lib/api';
import socket from '@/sockets/socket';

import { AnswerView, JudgeView, QuestionView, WaitView } from './_components';

import type {
  AnswerWithJudge,
  Participant,
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
  const [participants, setParticipants] = useState<Participant[]>([]);
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

    function onUpdateParticipants(nextParticipants: Participant[]) {
      setParticipants(nextParticipants);
    }

    socket.on('state:updated', onUpdateState);
    socket.on('question:updated', onUpdateQuestion);
    socket.on('answers:updated', onUpdateAnswers);
    socket.on('participants:updated', onUpdateParticipants);

    return () => {
      socket.off('state:updated', onUpdateState);
      socket.off('question:updated', onUpdateQuestion);
      socket.off('answers:updated', onUpdateAnswers);
      socket.off('participants:updated', onUpdateParticipants);
    };
  }, []);

  if (isLoading) {
    return <LoadingView />;
  }

  if (error || !data) {
    router.push('/');
    return <Alert severity="error">セッションの読み込みに失敗しました。</Alert>;
  }

  const activeQuestionId = question.id || data.currentQuestionId || '';

  return (
    <Container sx={{ py: 2 }}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Stack spacing={2}>
            <Typography component="h1" variant="h4">
              {data.title}
            </Typography>
            {sessionState === 'wait' && <WaitView />}
            {sessionState === 'question' && (
              <QuestionView
                title={question.title}
                maxPoints={question.max_points}
                type={question.type}
              />
            )}
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
                  sessionState === 'answer_check' ||
                  sessionState === 'judge_check'
                }
                showJudge={sessionState === 'judge_check'}
              />
            )}
          </Stack>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <ParticipantScoreList participants={participants} />
        </Grid>
      </Grid>
    </Container>
  );
}
