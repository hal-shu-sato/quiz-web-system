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

export type ScreenStates = 'linked' | 'answers' | 'judges' | 'scores';

function ScreenButton({
  children,
  state,
  screen,
  onClick,
}: PropsWithChildren<{
  state: ScreenStates;
  screen: ScreenStates;
  onClick: (screen: string) => void;
}>) {
  return (
    <Button
      fullWidth
      variant={state === screen ? 'contained' : 'text'}
      onClick={() => onClick(screen)}
    >
      {children}
    </Button>
  );
}

const gridSize: ResponsiveStyleValue<GridSize> = { xs: 6, lg: 'auto' };

export default function ScreenChangeButtons({
  state,
  onClick,
}: {
  state: ScreenStates;
  onClick: (screen: string) => void;
}) {
  return (
    <Card>
      <CardHeader title="画面変更" />
      <CardActions sx={{ display: 'inherit' }}>
        <Grid container spacing={2}>
          <Grid size={gridSize}>
            <ScreenButton state={state} screen="linked" onClick={onClick}>
              連動
            </ScreenButton>
          </Grid>
          <Grid size={gridSize}>
            <ScreenButton state={state} screen="answers" onClick={onClick}>
              回答表示
            </ScreenButton>
          </Grid>
          <Grid size={gridSize}>
            <ScreenButton state={state} screen="judges" onClick={onClick}>
              判定表示
            </ScreenButton>
          </Grid>
          <Grid size={gridSize}>
            <ScreenButton state={state} screen="scores" onClick={onClick}>
              スコア
            </ScreenButton>
          </Grid>
        </Grid>
      </CardActions>
    </Card>
  );
}
