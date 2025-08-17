import {
  Card,
  CardContent,
  CardHeader,
  Stack,
  Typography,
} from '@mui/material';

export default function ParticipantList({
  participants,
}: {
  participants: {
    id: string;
    name: string;
    score: number;
  }[];
}) {
  return (
    <Card>
      <CardHeader title="参加者一覧" />
      <CardContent>
        <Stack spacing={1}>
          {participants.map((participant) => (
            <Typography key={participant.id}>
              {participant.name} - スコア: {participant.score}
            </Typography>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
}
