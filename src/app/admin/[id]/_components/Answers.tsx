import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Typography,
} from '@mui/material';

type AnswerBase = {
  id: string;
  paticipant_name: string;
  result: 'pending' | 'correct' | 'partial' | 'incorrect' | 'dobon';
};
type TextAnswer = AnswerBase & {
  answer_text: string;
};
type ImageAnswer = AnswerBase & {
  answer_image_url: string;
};

export default function Answers({
  answers,
}: {
  answers: (TextAnswer | ImageAnswer)[];
}) {
  return (
    <Card>
      <CardHeader title="回答一覧" />
      <CardContent>
        {answers.map((answer) => (
          <Card key={answer.id} sx={{ mb: 2 }}>
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
