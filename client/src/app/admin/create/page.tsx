'use client';

import { useState } from 'react';

import {
  Alert,
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
          {error && <Alert severity="error">{error}</Alert>}
          <TextField
            label="セッション名"
            fullWidth
            autoFocus
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <TextField
            label="セッションコード"
            fullWidth
            required
            value={sessionCode}
            onChange={(e) => setSessionCode(e.target.value)}
          />
          <Button
            variant="contained"
            fullWidth
            disabled={loading || !sessionCode}
          >
            {loading ? '作成中...' : '作成'}
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
}
