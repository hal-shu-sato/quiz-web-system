import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Typography,
} from '@mui/material';

export default function ProblemCard({
  title,
  point,
}: {
  title: string;
  point: number;
}) {
  return (
    <Card>
      <CardHeader title="問題" />
      <CardContent>
        <Typography variant="h6">{title}</Typography>
        <Typography variant="body1">ポイント: {point}</Typography>
      </CardContent>
      <CardActions>
        <Button>編集</Button>
      </CardActions>
    </Card>
  );
}
