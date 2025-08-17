'use client';

import {
  AppBar,
  type Breakpoint,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Container,
  Grid,
  type GridSize,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material';

function StateChangeButtons({ onClick }: { onClick: (state: string) => void }) {
  return (
    <Card>
      <CardHeader title="状態変更" />
      <CardContent>
        <Grid container spacing={2}>
          <Grid size={{ xs: 4, lg: 'auto' }}>
            <Button fullWidth onClick={() => onClick('wait')}>
              待機
            </Button>
          </Grid>
          <Grid size={{ xs: 4, lg: 'auto' }}>
            <Button fullWidth onClick={() => onClick('question')}>
              出題
            </Button>
          </Grid>
          <Grid size={{ xs: 4, lg: 'auto' }}>
            <Button fullWidth onClick={() => onClick('answer')}>
              回答
            </Button>
          </Grid>
          <Grid size={{ xs: 4, lg: 'auto' }}>
            <Button fullWidth onClick={() => onClick('judge')}>
              回答締切
            </Button>
          </Grid>
          <Grid size={{ xs: 4, lg: 'auto' }}>
            <Button fullWidth onClick={() => onClick('answer_check')}>
              アンサーチェック
            </Button>
          </Grid>
          <Grid size={{ xs: 4, lg: 'auto' }}>
            <Button fullWidth onClick={() => onClick('judge_check')}>
              正解はこちら
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

function ProblemCard({ title, point }: { title: string; point: number }) {
  return (
    <Card>
      <CardHeader title="問題" />
      <CardContent>
        <Typography variant="h6">{title}</Typography>
        <Typography variant="body1">ポイント: {point}</Typography>
        <Button variant="contained" style={{ marginTop: '10px' }}>
          問題を編集
        </Button>
      </CardContent>
    </Card>
  );
}

function Answer({
  answers,
}: {
  answers: (
    | {
        id: string;
        answer_text: string;
        result: 'pending' | 'correct' | 'partial' | 'incorrect' | 'dobon';
      }
    | {
        id: string;
        answer_image_url: string;
        result: 'pending' | 'correct' | 'partial' | 'incorrect' | 'dobon';
      }
  )[];
}) {
  return (
    <Card>
      <CardHeader title="回答一覧" />
      <CardContent>
        {answers.map((answer) => (
          <Card key={answer.id} style={{ marginBottom: '10px' }}>
            <CardHeader
              title={`回答ID: ${answer.id}`}
              subheader={`結果: ${answer.result}`}
            />
            {'answer_image_url' in answer && (
              <CardMedia sx={{ height: 140 }} image={answer.answer_image_url} />
            )}
            {'answer_text' in answer && (
              <CardContent>
                <Typography variant="body1">{answer.answer_text}</Typography>
              </CardContent>
            )}
            <CardActions>
              <Button size="small" color="primary">
                正解
              </Button>
              <Button size="small" color="secondary">
                不正解
              </Button>
              <Button size="small" color="error">
                削除
              </Button>
            </CardActions>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
}

function ScreenChangeButtons({
  onClick,
}: {
  onClick: (screen: string) => void;
}) {
  return (
    <Card>
      <CardHeader title="画面変更" />
      <CardContent>
        <Grid container spacing={2}>
          <Grid size={{ xs: 6, lg: 'auto' }}>
            <Button fullWidth onClick={() => onClick('linked')}>
              連動
            </Button>
          </Grid>
          <Grid size={{ xs: 6, lg: 'auto' }}>
            <Button fullWidth onClick={() => onClick('answers')}>
              回答表示
            </Button>
          </Grid>
          <Grid size={{ xs: 6, lg: 'auto' }}>
            <Button fullWidth onClick={() => onClick('judges')}>
              判定表示
            </Button>
          </Grid>
          <Grid size={{ xs: 6, lg: 'auto' }}>
            <Button fullWidth onClick={() => onClick('scores')}>
              スコア
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

function ParticipantList({
  participants,
}: {
  participants: {
    id: string;
    name: string;
    score: number;
  }[];
}) {
  return (
    <Card>
      <CardHeader title="参加者一覧" />
      <CardContent>
        <Stack spacing={1}>
          {participants.map((participant) => (
            <Typography key={participant.id}>
              {participant.name} - スコア: {participant.score}
            </Typography>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
}

function AnswerOrderList({
  participants,
}: {
  participants: {
    id: string;
    name: string;
    score: number;
    answerOrder: number;
  }[];
}) {
  return (
    <Card>
      <CardHeader title="回答順一覧" />
      <CardContent>
        <Stack spacing={1}>
          {participants.map((participant) => (
            <Typography key={participant.id}>
              {participant.name} - スコア: {participant.score} - 回答順:{' '}
              {participant.answerOrder}
            </Typography>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
}

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
