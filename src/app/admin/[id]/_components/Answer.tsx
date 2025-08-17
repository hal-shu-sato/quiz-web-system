import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Typography,
} from '@mui/material';

export default function Answer({
  answers,
}: {
  answers: (
    | {
        id: string;
        answer_text: string;
        result: 'pending' | 'correct' | 'partial' | 'incorrect' | 'dobon';
      }
    | {
        id: string;
        answer_image_url: string;
        result: 'pending' | 'correct' | 'partial' | 'incorrect' | 'dobon';
      }
  )[];
}) {
  return (
    <Card>
      <CardHeader title="回答一覧" />
      <CardContent>
        {answers.map((answer) => (
          <Card key={answer.id} style={{ marginBottom: '10px' }}>
            <CardHeader
              title={`回答ID: ${answer.id}`}
              subheader={`結果: ${answer.result}`}
            />
            {'answer_image_url' in answer && (
              <CardMedia sx={{ height: 140 }} image={answer.answer_image_url} />
            )}
            {'answer_text' in answer && (
              <CardContent>
                <Typography variant="body1">{answer.answer_text}</Typography>
              </CardContent>
            )}
            <CardActions>
              <Button size="small" color="primary">
                正解
              </Button>
              <Button size="small" color="secondary">
                不正解
              </Button>
              <Button size="small" color="error">
                削除
              </Button>
            </CardActions>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
}
