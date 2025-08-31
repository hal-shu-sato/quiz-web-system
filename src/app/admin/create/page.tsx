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

export default function AdminCreate() {
  const [title, setTitle] = useState('');
  const [sessionCode, setSessionCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  return (
    <Container maxWidth="xs" sx={{ my: 3 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Stack spacing={2}>
          <Typography variant="h4" component="h1">
            セッション作成
          </Typography>
          <TextField
            label="セッション名"
            fullWidth
            autoFocus
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            error={!!error}
          />
          <TextField
            label="セッションコード"
            fullWidth
            required
            value={sessionCode}
            onChange={(e) => setSessionCode(e.target.value)}
            error={!!error}
          />
          <Button
            variant="contained"
            fullWidth
            disabled={loading || !sessionCode}
          >
            {loading ? '作成中...' : '作成'}
          </Button>
          {error && <Typography color="error">{error}</Typography>}
        </Stack>
      </Paper>
    </Container>
  );
}
