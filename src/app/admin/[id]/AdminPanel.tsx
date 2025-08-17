'use client';

import {
  AppBar,
  type Breakpoint,
  Container,
  Grid,
  type GridSize,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material';

import {
  Answer,
  AnswerOrderList,
  ParticipantList,
  ProblemCard,
  ScreenChangeButtons,
  StateChangeButtons,
} from './_components';

// from '@mui/material/esm/Grid/Grid.d.ts'
type ResponsiveStyleValue<T> =
  | T
  | Array<T | null>
  | { [key in Breakpoint]?: T | null };
const leftPanelSize: ResponsiveStyleValue<GridSize> = { xs: 12, md: 8 };
const rightPanelSize: ResponsiveStyleValue<GridSize> = { xs: 12, md: 4 };

export default function AdminPanel({ id }: { id: string }) {
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
      <Container style={{ marginTop: '20px' }}>
        <Stack spacing={2}>
          <Grid container spacing={2}>
            <Grid size={leftPanelSize}>
              <StateChangeButtons
                onClick={(state) => {
                  console.log(`State changed to: ${state}`);
                }}
              />
            </Grid>
            <Grid size={rightPanelSize}>
              <ScreenChangeButtons
                onClick={(screen) => {
                  console.log(`Screen changed to: ${screen}`);
                }}
              />
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid size={leftPanelSize}>
              <Stack spacing={2}>
                <ProblemCard title="Sample Problem" point={10} />
                <Answer
                  answers={[
                    {
                      id: '1',
                      answer_text: 'Sample Answer 1',
                      result: 'correct',
                    },
                    {
                      id: '2',
                      answer_image_url: 'https://picsum.photos/300',
                      result: 'incorrect',
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
