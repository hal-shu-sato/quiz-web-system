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

import Link from '@/components/link';
import $api from '@/lib/api';

export default function Home() {
  const [sessionCode, setSessionCode] = useState('');
  const [name, setName] = useState('');
  const [reconnectionCode, setReconnectionCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const router = useRouter();

  const { mutate } = $api.useMutation('post', '/join');

  const handleSubmit = () => {
    setLoading(true);
    setError('');
    mutate(
      {
        body: {
          code: sessionCode,
          name: name,
          reconnectionCode: reconnectionCode,
        },
      },
      {
        onSuccess: (data) => {
          console.log(data);
          router.push(`/${data.session.id}`);
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
            参加
          </Typography>
          <Link href="/login">ログインはこちら</Link>
          {error && <Alert severity="error">{error}</Alert>}
          <TextField
            label="セッションコード"
            fullWidth
            autoFocus
            required
            value={sessionCode}
            onChange={(e) => setSessionCode(e.target.value)}
          />
          <TextField
            label="名前"
            fullWidth
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            label="再接続コード"
            fullWidth
            required
            value={reconnectionCode}
            onChange={(e) => setReconnectionCode(e.target.value)}
          />
          <Button
            variant="contained"
            fullWidth
            disabled={loading || !sessionCode || !name || !reconnectionCode}
            onClick={handleSubmit}
          >
            {loading ? '参加中...' : '参加'}
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
}
