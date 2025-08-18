import {
  Card,
  CardContent,
  CardHeader,
  List,
  ListItem,
  ListItemText,
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
        <List>
          {participants.map((participant) => (
            <ListItem key={participant.id}>
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
