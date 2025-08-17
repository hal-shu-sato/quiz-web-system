import { Button, Card, CardContent, CardHeader, Grid } from '@mui/material';

export default function ScreenChangeButtons({
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
