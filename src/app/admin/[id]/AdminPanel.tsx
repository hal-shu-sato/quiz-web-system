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

const leftPanelSize: ResponsiveStyleValue<GridSize> = { xs: 12, md: 8 };
const rightPanelSize: ResponsiveStyleValue<GridSize> = { xs: 12, md: 4 };

export default function AdminPanel({ id }: { id: string }) {
  const [sessionState, setSessionState] = useState<SessionStates>('wait');
  const [screenState, setScreenState] = useState<ScreenStates>('linked');

  useEffect(() => {
    function onConnect() {
      console.log('Admin socket connected');

      adminSocket.io.engine.on('upgrade', (transport) => {
        console.log(`Transport upgraded to: ${transport.name}`);
      });
    }

    function onUpdateState(newState: SessionStates) {
      console.log(`Session state changed to: ${newState}`);
      setSessionState(newState);
    }

    function onUpdateScreen(newScreen: ScreenStates) {
      console.log(`Screen state changed to: ${newScreen}`);
      setScreenState(newScreen);
    }

    function onDisconnect() {
      console.log('Admin socket disconnected');
    }

    if (adminSocket.connected) {
      onConnect();
    }

    adminSocket.on('connect', onConnect);
    adminSocket.on('state:updated', onUpdateState);
    adminSocket.on('screen:updated', onUpdateScreen);
    adminSocket.on('disconnect', onDisconnect);

    return () => {
      adminSocket.off('connect', onConnect);
      adminSocket.off('state:updated', onUpdateState);
      adminSocket.off('screen:updated', onUpdateScreen);
      adminSocket.off('disconnect', onDisconnect);
    };
  }, []);

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
                <ProblemCard title="Sample Problem" point={10} />
                <Answers
                  answers={[
                    {
                      id: '1',
                      participant_name: 'Alice',
                      answer_text: 'Sample Answer 1',
                      result: 'correct',
                    },
                    {
                      id: '2',
                      participant_name: 'Bob',
                      answer_image_url: 'https://picsum.photos/640/360',
                      result: 'incorrect',
                    },
                    {
                      id: '3',
                      participant_name: 'Charlie',
                      answer_text: 'Sample Answer 2',
                      result: 'partial',
                    },
                    {
                      id: '4',
                      participant_name: 'David',
                      answer_image_url: 'https://picsum.photos/640/360',
                      result: 'dobon',
                    },
                  ]}
                />
              </Stack>
            </Grid>
            <Grid size={rightPanelSize}>
              <Stack spacing={2}>
                <ParticipantList
                  participants={[
                    { id: '1', name: 'Alice', score: 100 },
                    { id: '2', name: 'Bob', score: 80 },
                  ]}
                />
                <AnswerOrderList
                  participants={[
                    { id: '1', name: 'Alice', score: 100, answerOrder: 1 },
                    { id: '2', name: 'Bob', score: 80, answerOrder: 2 },
                  ]}
                />
              </Stack>
            </Grid>
          </Grid>
        </Stack>
      </Container>
    </>
  );
}
