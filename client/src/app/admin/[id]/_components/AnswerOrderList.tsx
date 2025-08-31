import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from '@mui/material';

export default function AnswerOrderList({
  participants,
}: {
  participants: {
    id: string;
    name: string;
    score: number;
    answer_order: number;
  }[];
}) {
  const sortedParticipants = [...participants].sort(
    (a, b) => a.answer_order - b.answer_order,
  );

  return (
    <Card>
      <CardHeader title="回答順一覧" />
      <CardContent>
        <List>
          {sortedParticipants.map((participant) => (
            <ListItem key={participant.id}>
              <ListItemAvatar>
                <Avatar>{participant.answer_order}</Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={participant.name}
                secondary={`ID: ${participant.id} - スコア: ${participant.score}`}
              />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
}
