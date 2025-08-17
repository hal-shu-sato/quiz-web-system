import { Button, Card, CardContent, CardHeader, Grid } from '@mui/material';

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
