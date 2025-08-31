'use client';

import { useState } from 'react';

import {
  Button,
  Container,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

export default function Home() {
  const [sessionCode, setSessionCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  return (
    <Container maxWidth="xs" sx={{ my: 3 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Stack spacing={2}>
          <Typography variant="h4" component="h1">
            参加
          </Typography>
          <TextField
            label="セッションコード"
            fullWidth
            autoFocus
            required
            value={sessionCode}
            onChange={(e) => setSessionCode(e.target.value)}
            error={!!error}
            helperText={error}
          />
          <Button
            variant="contained"
            fullWidth
            disabled={loading || !sessionCode}
          >
            {loading ? '参加中...' : '参加'}
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
}
