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
import { useRouter } from 'next/navigation';

import $api from '@/lib/api';

export default function AdminLogin() {
  const [sessionCode, setSessionCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const router = useRouter();

  const { mutate } = $api.useMutation('post', '/admin/login');

  const handleSubmit = () => {
    setLoading(true);
    setError('');
    mutate(
      {
        body: {
          code: sessionCode,
        },
      },
      {
        onSuccess: (data) => {
          localStorage.setItem('token', data.token);
          router.push(`/admin/${data.session.id}`);
        },
        onError: (error) => {
          setError(error.message);
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
            onClick={handleSubmit}
          >
            {loading ? 'ログイン中...' : 'ログイン'}
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
}
