import {
  Button,
  ButtonGroup,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Grid,
  Typography,
} from '@mui/material';

function getResult(
  result: 'pending' | 'correct' | 'partial' | 'incorrect' | 'dobon',
) {
  switch (result) {
    case 'pending':
      return '判定中';
    case 'correct':
      return '正解';
    case 'partial':
      return '部分点';
    case 'incorrect':
      return '不正解';
    case 'dobon':
      return 'ドボン';
    default:
      return '不明';
  }
}

type AnswerBase = {
  id: string;
  participant_name: string;
  judgment_result: 'pending' | 'correct' | 'partial' | 'incorrect' | 'dobon';
  awarded_points: number;
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
        <Grid container spacing={2}>
          {answers.map((answer) => (
            <Grid size={{ xs: 12, sm: 6 }} key={answer.id}>
              <Card>
                {'answer_image_url' in answer && (
                  <CardMedia component="img" image={answer.answer_image_url} />
                )}
                {'answer_text' in answer && (
                  <CardContent>
                    <Typography variant="body1">
                      {answer.answer_text}
                    </Typography>
                  </CardContent>
                )}
                <CardHeader
                  title={answer.participant_name}
                  subheader={`結果: ${getResult(answer.judgment_result)} | 獲得点数: ${answer.awarded_points}`}
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
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
}
