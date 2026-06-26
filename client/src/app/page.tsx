'use client';

import { useState } from 'react';

import {
  Alert,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useRouter } from 'next/navigation';

import Link from '@/components/link';
import { persistAuthSession, reconnectSockets } from '@/lib/authSession';
import $api from '@/lib/api';

export default function Home() {
  const [sessionCode, setSessionCode] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [issuedCode, setIssuedCode] = useState('');
  const [pendingSessionId, setPendingSessionId] = useState('');

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
        },
      },
      {
        onSuccess: (data) => {
          persistAuthSession({
            token: data.token,
            participantId: data.participant.id,
          });
          reconnectSockets('participant');
          setIssuedCode(data.participant.reconnectionCode ?? '');
          setPendingSessionId(data.session.id);
          setLoading(false);
        },
        onError: (joinError) => {
          setError(joinError.message);
          setLoading(false);
        },
      },
    );
  };

  const handleEnterSession = () => {
    router.push(`/${pendingSessionId}`);
  };

  return (
    <Container maxWidth="xs" sx={{ my: 3 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Stack spacing={2}>
          <Typography variant="h4" component="h1">
            参加
          </Typography>
          <Link href="/login">再接続ログインはこちら</Link>
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
          <Button
            variant="contained"
            fullWidth
            disabled={loading || !sessionCode || !name}
            onClick={handleSubmit}
          >
            {loading ? '参加中...' : '参加'}
          </Button>
        </Stack>
      </Paper>

      <Dialog open={!!issuedCode} onClose={handleEnterSession} fullWidth>
        <DialogTitle>参加が完了しました</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <Typography>
              再接続用コードを控えてください。端末を変えたときや再接続時に使います。
            </Typography>
            <Alert
              severity="info"
              sx={{ fontSize: 24, justifyContent: 'center' }}
            >
              {issuedCode}
            </Alert>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={handleEnterSession}>
            クイズ画面へ進む
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
