import { Chip, Paper, Stack, Typography } from '@mui/material';

export default function QuestionView({
  title,
  maxPoints,
  type,
}: {
  title: string;
  maxPoints?: number;
  type?: 'normal' | 'dobon';
}) {
  return (
    <Paper sx={{ p: 3, mt: 2 }}>
      <Stack spacing={1}>
        <Typography variant="h6">出題中</Typography>
        <Typography variant="h5">{title}</Typography>
        {typeof maxPoints === 'number' && (
          <Typography color="text.secondary">配点: {maxPoints}点</Typography>
        )}
        {type === 'dobon' && <Chip label="ドボン問題" color="warning" />}
      </Stack>
    </Paper>
  );
}
