import {
  Button,
  Card,
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
        <Button variant="contained" style={{ marginTop: '10px' }}>
          問題を編集
        </Button>
      </CardContent>
    </Card>
  );
}
