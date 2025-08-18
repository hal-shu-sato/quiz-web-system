import {
  Card,
  CardContent,
  CardHeader,
  List,
  ListItem,
  ListItemText,
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
  const sortedParticipants = [...participants].sort(
    (a, b) => a.answerOrder - b.answerOrder,
  );

  return (
    <Card>
      <CardHeader title="回答順一覧" />
      <CardContent>
        <List>
          {sortedParticipants.map((participant) => (
            <ListItem key={participant.id}>
              <ListItemText
                primary={participant.name}
                secondary={`ID: ${participant.id} - スコア: ${participant.score} - 回答順: ${participant.answerOrder}`}
              />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
}
