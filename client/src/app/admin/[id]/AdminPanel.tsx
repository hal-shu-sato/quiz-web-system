'use client';

import { useEffect, useState } from 'react';

import {
  AppBar,
  Container,
  Grid,
  type GridSize,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material';
import { useRouter } from 'next/navigation';

import { adminSocket } from '@/socket';
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

export default function AdminPanel({ id }: { id: string }) {
  const [sessionState, setSessionState] = useState<SessionStates>('wait');
  const [screenState, setScreenState] = useState<ScreenStates>('linked');
  const [participants, setParticipants] = useState<Participant[]>([
    {
      id: '1',
      name: 'Alice',
      score: 100,
      is_dobon: false,
      answer_order: 1,
    },
    {
      id: '2',
      name: 'Bob',
      score: 80,
      is_dobon: false,
      answer_order: 2,
    },
  ]);
  const [question, setQuestion] = useState<Question>({
    id: 'sample1',
    title: 'サンプル問題',
    max_points: 0,
    type: 'normal',
  });
  const [answers, setAnswers] = useState<AnswerWithJudge[]>([
    {
      id: '1',
      participant_id: '1',
      participant_name: 'Alice',
      question_id: 'sample1',
      answer_text: 'Sample Answer 1',
      judgment_result: 'correct',
      awarded_points: 10,
    },
    {
      id: '2',
      participant_id: '2',
      participant_name: 'Bob',
      question_id: 'sample1',
      answer_image_url: 'https://picsum.photos/640/360',
      judgment_result: 'incorrect',
      awarded_points: 0,
    },
    {
      id: '3',
      participant_id: '3',
      participant_name: 'Charlie',
      question_id: 'sample1',
      answer_text: 'Sample Answer 2',
      judgment_result: 'partial',
      awarded_points: 5,
    },
    {
      id: '4',
      participant_id: '4',
      participant_name: 'David',
      question_id: 'sample1',
      answer_image_url: 'https://picsum.photos/640/360',
      judgment_result: 'dobon',
      awarded_points: 0,
    },
  ]);

  const router = useRouter();

  useEffect(() => {
    function onConnect() {
      console.log('Admin socket connected');

      adminSocket.io.engine.on('upgrade', (transport) => {
        console.log(`Transport upgraded to: ${transport.name}`);
      });
    }

    function onConnectError(err: Error & { code?: number }) {
      console.error('Admin socket connection error:', err.message);

      if (err.code === 1) {
        router.push('/admin/login');
      }
    }

    function onUpdateState(newState: SessionStates) {
      console.log(`Session state changed to: ${newState}`);
      setSessionState(newState);
    }

    function onUpdateScreen(newScreen: ScreenStates) {
      console.log(`Screen state changed to: ${newScreen}`);
      setScreenState(newScreen);
    }

    function onUpdateParticipants(participants: Participant[]) {
      console.log(`Participants updated: ${participants.length}`);
      setParticipants(participants);
    }

    function onUpdateQuestion(question: Question) {
      console.log(`Question updated: ${question.title}`);
      setQuestion(question);
    }

    function onUpdateAnswers(answers: AnswerWithJudge[]) {
      console.log(`Answers updated: ${answers.length}`);
      setAnswers(answers);
    }

    function onDisconnect() {
      console.log('Admin socket disconnected');
    }

    if (adminSocket.connected) {
      onConnect();
    }

    adminSocket.on('connect', onConnect);
    adminSocket.on('connect_error', onConnectError);
    adminSocket.on('state:updated', onUpdateState);
    adminSocket.on('screen:updated', onUpdateScreen);
    adminSocket.on('participants:updated', onUpdateParticipants);
    adminSocket.on('question:updated', onUpdateQuestion);
    adminSocket.on('answers:updated', onUpdateAnswers);
    adminSocket.on('disconnect', onDisconnect);

    return () => {
      adminSocket.off('connect', onConnect);
      adminSocket.off('state:updated', onUpdateState);
      adminSocket.off('screen:updated', onUpdateScreen);
      adminSocket.off('participants:updated', onUpdateParticipants);
      adminSocket.off('question:updated', onUpdateQuestion);
      adminSocket.off('answers:updated', onUpdateAnswers);
      adminSocket.off('disconnect', onDisconnect);
    };
  }, [router]);

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="h1" sx={{ flexGrow: 1 }}>
            管理パネル
          </Typography>
          <Typography variant="subtitle1">ID: {id}</Typography>
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
                  title={question.title}
                  point={question.max_points}
                />
                <Answers answers={answers} />
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
