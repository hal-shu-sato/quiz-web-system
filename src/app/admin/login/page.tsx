import { Button, Container, Paper, Stack, TextField } from '@mui/material';

export default function AdminLogin() {
  return (
    <Container maxWidth="xs">
      <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
        <Stack spacing={2}>
          <h1>運営ログイン</h1>
          <TextField label="セッションコード" fullWidth autoFocus required />
          <Button variant="contained" fullWidth>
            ログイン
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
}
