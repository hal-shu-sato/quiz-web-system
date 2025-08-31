import {
  Card,
  CardContent,
  CardHeader,
  Chip,
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
            <ListItem
              key={participant.id}
              secondaryAction={<Chip label={participant.score} color="info" />}
            >
              <ListItemText
                primary={participant.name}
                secondary={`ID: ${participant.id}`}
              />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
}
