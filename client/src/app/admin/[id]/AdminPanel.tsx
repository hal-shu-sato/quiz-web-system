'use client';

import { useEffect, useState } from 'react';

import {
  AppBar,
  Button,
  Container,
  Grid,
  type GridSize,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import adminSocket from '@/sockets/adminSocket';
import type ResponsiveStyleValue from '@/types/ResponsiveStyleValue';

import {
  AnswerOrderList,
  Answers,
  ParticipantList,
  ProblemCard,
  ScreenChangeButtons,
  StateChangeButtons,
} from './_components';

import type { ScreenStates } from './_components/ScreenChangeButtons';
import type { SessionStates } from './_components/StateChangeButtons';
import type {
  AnswerWithJudge,
  Participant,
  Question,
} from '../../../../../server/src/sockets/events';

const leftPanelSize: ResponsiveStyleValue<GridSize> = { xs: 12, md: 8 };
const rightPanelSize: ResponsiveStyleValue<GridSize> = { xs: 12, md: 4 };

const EMPTY_QUESTION: Question = {
  id: '',
  title: '問題未設定',
  max_points: 0,
  type: 'normal',
};

export default function AdminPanel({ id }: { id: string }) {
  const [sessionState, setSessionState] = useState<SessionStates>('wait');
  const [screenState, setScreenState] = useState<ScreenStates>('linked');
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [question, setQuestion] = useState<Question>(EMPTY_QUESTION);
  const [answers, setAnswers] = useState<AnswerWithJudge[]>([]);

  const router = useRouter();

  useEffect(() => {
    function onConnectError(err: Error & { code?: number }) {
      console.error('Admin socket connection error:', err.message);

      if (err.code === 1) {
        router.push('/admin/login');
      }
    }

    function onUpdateState(newState: SessionStates) {
      setSessionState(newState);
    }

    function onUpdateScreen(newScreen: ScreenStates) {
      setScreenState(newScreen);
    }

    function onUpdateParticipants(nextParticipants: Participant[]) {
      setParticipants(nextParticipants);
    }

    function onUpdateQuestion(nextQuestion: Question) {
      setQuestion(nextQuestion);
    }

    function onUpdateAnswers(nextAnswers: AnswerWithJudge[]) {
      setAnswers(nextAnswers);
    }

    adminSocket.on('connect_error', onConnectError);
    adminSocket.on('state:updated', onUpdateState);
    adminSocket.on('screen:updated', onUpdateScreen);
    adminSocket.on('participants:updated', onUpdateParticipants);
    adminSocket.on('question:updated', onUpdateQuestion);
    adminSocket.on('answers:updated', onUpdateAnswers);

    return () => {
      adminSocket.off('connect_error', onConnectError);
      adminSocket.off('state:updated', onUpdateState);
      adminSocket.off('screen:updated', onUpdateScreen);
      adminSocket.off('participants:updated', onUpdateParticipants);
      adminSocket.off('question:updated', onUpdateQuestion);
      adminSocket.off('answers:updated', onUpdateAnswers);
    };
  }, [router]);

  const handleQuestionSave = (
    title: string,
    point: number,
    type: 'normal' | 'dobon',
  ) => {
    const payload = {
      title,
      max_points: point,
      type,
    };

    if (question.id) {
      adminSocket.emit('question:update', question.id, payload);
      return;
    }

    adminSocket.emit('question:create', payload);
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar sx={{ gap: 2 }}>
          <Typography variant="h6" component="h1" sx={{ flexGrow: 1 }}>
            管理パネル
          </Typography>
          <Button
            component={Link}
            href={`/admin/${id}/screen`}
            color="inherit"
            variant="outlined"
            size="small"
          >
            会場スクリーン
          </Button>
          <Typography variant="subtitle2">ID: {id}</Typography>
        </Toolbar>
      </AppBar>
      <Container sx={{ my: 2 }}>
        <Stack spacing={2}>
          <Grid container spacing={2}>
            <Grid size={leftPanelSize}>
              <StateChangeButtons
                state={sessionState}
                onClick={(state) => {
                  adminSocket.emit('state:update', state);
                }}
              />
            </Grid>
            <Grid size={rightPanelSize}>
              <ScreenChangeButtons
                state={screenState}
                onClick={(screen) => {
                  adminSocket.emit('screen:update', screen);
                }}
              />
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid size={leftPanelSize}>
              <Stack spacing={2}>
                <ProblemCard
                  questionId={question.id}
                  title={question.title}
                  point={question.max_points}
                  type={question.type}
                  onSave={handleQuestionSave}
                  onNextQuestion={() => {
                    adminSocket.emit('question:next');
                  }}
                />
                <Answers
                  answers={answers}
                  maxPoints={question.max_points}
                  onJudge={(answerId, judgment, awardedPoints) => {
                    adminSocket.emit('judge:update', answerId, {
                      judgment_result: judgment,
                      awarded_points: awardedPoints,
                    });
                  }}
                  onDelete={(answerId) => {
                    adminSocket.emit('answer:delete', answerId);
                  }}
                />
              </Stack>
            </Grid>
            <Grid size={rightPanelSize}>
              <Stack spacing={2}>
                <ParticipantList participants={participants} />
                <AnswerOrderList participants={participants} />
              </Stack>
            </Grid>
          </Grid>
        </Stack>
      </Container>
    </>
  );
}
