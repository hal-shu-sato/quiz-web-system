import { Box, CircularProgress, Typography } from '@mui/material';

export default function LoadingView({
  label = '読み込み中...',
}: {
  label?: string;
}) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, my: 3 }}>
      <CircularProgress size={24} />
      <Typography>{label}</Typography>
    </Box>
  );
}
