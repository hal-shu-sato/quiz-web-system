import {
  Card,
  CardContent,
  CardHeader,
  Chip,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';

export default function ParticipantScoreList({
  participants,
}: {
  participants: {
    id: string;
    name: string;
    score: number;
  }[];
}) {
  const sortedParticipants = [...participants].sort(
    (a, b) => b.score - a.score,
  );

  return (
    <Card>
      <CardHeader title="スコア" />
      <CardContent>
        <List dense>
          {sortedParticipants.map((participant, index) => (
            <ListItem
              key={participant.id}
              secondaryAction={<Chip label={participant.score} color="info" />}
            >
              <ListItemText
                primary={`${index + 1}. ${participant.name}`}
                secondary={`ID: ${participant.id}`}
              />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
}
