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
  sort = 'id',
}: {
  participants: {
    id: string;
    name: string;
    score: number;
  }[];
  sort?: 'id' | 'score';
}) {
  const sortedParticipants = [...participants].sort((a, b) => {
    if (sort === 'score') {
      return b.score - a.score; // Descending order by score
    }
    return a.id.localeCompare(b.id); // Ascending order by ID
  });

  return (
    <Card>
      <CardHeader title="参加者一覧" />
      <CardContent>
        <List>
          {sortedParticipants.map((participant) => (
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
