import type { PropsWithChildren } from 'react';

import {
  Button,
  Card,
  CardActions,
  CardHeader,
  Grid,
  type GridSize,
} from '@mui/material';

import type ResponsiveStyleValue from '@/types/ResponsiveStyleValue';

export type SessionStates =
  | 'wait'
  | 'question'
  | 'answer'
  | 'judge'
  | 'answer_check'
  | 'judge_check';

function StateButton({
  children,
  state,
  stateName,
  onClick,
}: PropsWithChildren<{
  state: SessionStates;
  stateName: SessionStates;
  onClick: (state: SessionStates) => void;
}>) {
  return (
    <Button
      fullWidth
      variant={state === stateName ? 'contained' : 'text'}
      onClick={() => onClick(stateName)}
    >
      {children}
    </Button>
  );
}

const gridSize: ResponsiveStyleValue<GridSize> = { xs: 4, lg: 'auto' };

export default function StateChangeButtons({
  state,
  onClick,
}: {
  state: SessionStates;
  onClick: (state: SessionStates) => void;
}) {
  return (
    <Card>
      <CardHeader title="状態変更" />
      <CardActions sx={{ display: 'inherit' }}>
        <Grid container spacing={2}>
          <Grid size={gridSize}>
            <StateButton state={state} stateName="wait" onClick={onClick}>
              待機
            </StateButton>
          </Grid>
          <Grid size={gridSize}>
            <StateButton state={state} stateName="question" onClick={onClick}>
              出題
            </StateButton>
          </Grid>
          <Grid size={gridSize}>
            <StateButton state={state} stateName="answer" onClick={onClick}>
              回答
            </StateButton>
          </Grid>
          <Grid size={gridSize}>
            <StateButton state={state} stateName="judge" onClick={onClick}>
              回答締切
            </StateButton>
          </Grid>
          <Grid size={gridSize}>
            <StateButton
              state={state}
              stateName="answer_check"
              onClick={onClick}
            >
              アンサーチェック
            </StateButton>
          </Grid>
          <Grid size={gridSize}>
            <StateButton
              state={state}
              stateName="judge_check"
              onClick={onClick}
            >
              正解はこちら
            </StateButton>
          </Grid>
        </Grid>
      </CardActions>
    </Card>
  );
}
