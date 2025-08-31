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

export default function AdminLogin() {
  const [sessionCode, setSessionCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  return (
    <Container maxWidth="xs" sx={{ my: 3 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Stack spacing={2}>
          <Typography variant="h4" component="h1">
            運営ログイン
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
            {loading ? 'ログイン中...' : 'ログイン'}
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
}
