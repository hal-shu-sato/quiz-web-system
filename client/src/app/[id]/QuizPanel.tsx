'use client';

import { useEffect, useState } from 'react';

import { Box, Container, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';

import $api from '@/lib/api';
import { socket } from '@/socket';

import { AnswerView, JudgeView, QuestionView, WaitView } from './_components';

import type { Judge } from '../../../../server/src/sockets/events';
import type { SessionStates } from '../admin/[id]/_components/StateChangeButtons';

export default function QuizPanel({ id }: { id: string }) {
  const [sessionState, setSessionState] = useState<SessionStates>('wait');
  const [judge, setJudge] = useState<Judge | null>(null);

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
    function onConnect() {
      console.log('Socket connected');

      socket.io.engine.on('upgrade', (transport) => {
        console.log(`Transport upgraded to: ${transport.name}`);
      });
    }

    function onUpdateState(newState: SessionStates) {
      console.log(`Session state changed to: ${newState}`);
      setSessionState(newState);
    }

    function onUpdateJudge(judge: Judge) {
      console.log(`Judge updated: ${judge.judgment_result}`);
      setJudge(judge);
    }

    function onDisconnect() {
      console.log('Socket disconnected');
    }

    if (socket.connected) {
      onConnect();
    }

    socket.on('connect', onConnect);
    socket.on('state:updated', onUpdateState);
    socket.on('judge:updated', onUpdateJudge);
    socket.on('disconnect', onDisconnect);

    return () => {
      socket.off('connect', onConnect);
      socket.off('state:updated', onUpdateState);
      socket.off('judge:updated', onUpdateJudge);
      socket.off('disconnect', onDisconnect);
    };
  }, []);

  if (isLoading) {
    return <Box>Loading...</Box>;
  }

  if (error || !data) {
    router.push('/');
    return <Box>Error loading session. Redirecting to home...</Box>;
  }

  return (
    <Container>
      <Typography component="h1" variant="h4">
        Quiz Panel for {data.title}
      </Typography>
      {sessionState === 'wait' && <WaitView />}
      {sessionState === 'question' && <QuestionView />}
      {sessionState === 'answer' && <AnswerView />}
      {(sessionState === 'judge' ||
        sessionState === 'answer_check' ||
        sessionState === 'judge_check') && (
        <JudgeView
          judge={judge}
          showAnswer={
            sessionState === 'answer_check' || sessionState === 'judge_check'
          }
          showJudge={sessionState === 'judge_check'}
        />
      )}
    </Container>
  );
}
