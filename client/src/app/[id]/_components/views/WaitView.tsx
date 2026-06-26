import { Paper, Typography } from '@mui/material';

export default function WaitView() {
  return (
    <Paper sx={{ p: 3, mt: 2 }}>
      <Typography variant="h6">待機中</Typography>
      <Typography color="text.secondary">出題開始をお待ちください。</Typography>
    </Paper>
  );
}
