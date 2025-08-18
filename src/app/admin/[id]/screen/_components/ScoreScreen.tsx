import {
  Avatar,
  Box,
  Chip,
  Container,
  createTheme,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ThemeProvider,
  Typography,
} from '@mui/material';

const theme = createTheme({
  typography: {
    fontSize: 30,
  },
});

export default function ScoreScreen({
  participants,
}: {
  participants: {
    participant_id: string;
    participant_name: string;
    score: number;
  }[];
}) {
  const sortedParticipants = participants.sort((a, b) => b.score - a.score);

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '90vh',
        }}
      >
        <Container maxWidth="sm">
          <Box sx={{ mb: 2, textAlign: 'center' }}>
            <Typography variant="h6" component="h1">
              スコアボード
            </Typography>
          </Box>
          <List>
            {sortedParticipants.map((participant, index) => (
              <ListItem
                key={participant.participant_id}
                secondaryAction={
                  <Chip label={participant.score} color="info" />
                }
              >
                <ListItemAvatar>
                  <Avatar>{index + 1}</Avatar>
                </ListItemAvatar>
                <ListItemText primary={participant.participant_name} />
              </ListItem>
            ))}
          </List>
        </Container>
      </Box>
    </ThemeProvider>
  );
}
