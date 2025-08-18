import {
  Button,
  ButtonGroup,
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
            {'answer_image_url' in answer && (
              <CardMedia component="img" image={answer.answer_image_url} />
            )}
            {'answer_text' in answer && (
              <CardContent>
                <Typography variant="body1">{answer.answer_text}</Typography>
              </CardContent>
            )}
            <CardHeader
              title={answer.paticipant_name}
              subheader={`結果: ${answer.result}`}
            />
            <CardActions sx={{ justifyContent: 'space-between' }}>
              <ButtonGroup variant="text" size="small">
                <Button color="primary">正解</Button>
                <Button color="success">部分点</Button>
                <Button color="error">不正解</Button>
                <Button color="secondary">ドボン</Button>
              </ButtonGroup>
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
