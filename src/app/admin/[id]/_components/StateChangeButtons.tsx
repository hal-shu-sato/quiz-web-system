import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Grid,
  type GridSize,
} from '@mui/material';

import type ResponsiveStyleValue from '@/types/ResponsiveStyleValue';

const gridSize: ResponsiveStyleValue<GridSize> = { xs: 4, lg: 'auto' };

export default function StateChangeButtons({
  onClick,
}: {
  onClick: (state: string) => void;
}) {
  return (
    <Card>
      <CardHeader title="状態変更" />
      <CardContent>
        <Grid container spacing={2}>
          <Grid size={gridSize}>
            <Button fullWidth onClick={() => onClick('wait')}>
              待機
            </Button>
          </Grid>
          <Grid size={gridSize}>
            <Button fullWidth onClick={() => onClick('question')}>
              出題
            </Button>
          </Grid>
          <Grid size={gridSize}>
            <Button fullWidth onClick={() => onClick('answer')}>
              回答
            </Button>
          </Grid>
          <Grid size={gridSize}>
            <Button fullWidth onClick={() => onClick('judge')}>
              回答締切
            </Button>
          </Grid>
          <Grid size={gridSize}>
            <Button fullWidth onClick={() => onClick('answer_check')}>
              アンサーチェック
            </Button>
          </Grid>
          <Grid size={gridSize}>
            <Button fullWidth onClick={() => onClick('judge_check')}>
              正解はこちら
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
