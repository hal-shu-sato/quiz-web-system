import {
  Card,
  CardContent,
  CardHeader,
  Stack,
  Typography,
} from '@mui/material';

export default function AnswerOrderList({
  participants,
}: {
  participants: {
    id: string;
    name: string;
    score: number;
    answerOrder: number;
  }[];
}) {
  return (
    <Card>
      <CardHeader title="回答順一覧" />
      <CardContent>
        <Stack spacing={1}>
          {participants.map((participant) => (
            <Typography key={participant.id}>
              {participant.name} - スコア: {participant.score} - 回答順:{' '}
              {participant.answerOrder}
            </Typography>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
}
