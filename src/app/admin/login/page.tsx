'use client';

import { useState } from 'react';

import { Button, Container, Paper, Stack, TextField } from '@mui/material';

export default function AdminLogin() {
  const [sessionCode, setSessionCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  return (
    <Container maxWidth="xs">
      <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
        <Stack spacing={2}>
          <h1>運営ログイン</h1>
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
