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
import { useRouter } from 'next/navigation';

import $api from '@/lib/api';

export default function AdminCreate() {
  const [title, setTitle] = useState('');
  const [sessionCode, setSessionCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const router = useRouter();

  const { mutate } = $api.useMutation('post', '/sessions');

  const handleSubmit = () => {
    setLoading(true);
    setError('');
    mutate(
      { body: { title, code: sessionCode } },
      {
        onSuccess: (data) => {
          router.push(`/admin/${data.id}`);
          setLoading(false);
        },
        onError: (err) => {
          setError(err.message || 'セッションの作成に失敗しました');
          setLoading(false);
        },
      },
    );
  };

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
            disabled={loading || !title || !sessionCode}
            onClick={handleSubmit}
          >
            {loading ? '作成中...' : '作成'}
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
}
