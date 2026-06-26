'use client';

import { useState } from 'react';

import {
  Button,
  ButtonGroup,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
  Typography,
} from '@mui/material';

import { toAbsoluteFileUrl } from '@/lib/fileUrl';

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
  maxPoints,
  onJudge,
  onDelete,
}: {
  answers: (TextAnswer | ImageAnswer)[];
  maxPoints: number;
  onJudge: (
    answerId: string,
    judgment: 'correct' | 'partial' | 'incorrect' | 'dobon',
    awardedPoints: number,
  ) => void;
  onDelete: (answerId: string) => void;
}) {
  const [partialTargetId, setPartialTargetId] = useState<string | null>(null);
  const [partialPoints, setPartialPoints] = useState(
    Math.max(1, Math.floor(maxPoints / 2)),
  );

  const handleOpenPartial = (answerId: string) => {
    setPartialTargetId(answerId);
    setPartialPoints(Math.max(1, Math.floor(maxPoints / 2)));
  };

  const handleSubmitPartial = () => {
    if (!partialTargetId) {
      return;
    }

    onJudge(partialTargetId, 'partial', partialPoints);
    setPartialTargetId(null);
  };

  return (
    <>
      <Card>
        <CardHeader title="回答一覧" />
        <CardContent>
          <Grid container spacing={2}>
            {answers.map((answer) => (
              <Grid size={{ xs: 12, sm: 6 }} key={answer.id}>
                <Card>
                  {'answer_image_url' in answer && (
                    <CardMedia
                      component="img"
                      image={toAbsoluteFileUrl(answer.answer_image_url)}
                    />
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
                      <Button
                        color="primary"
                        onClick={() => onJudge(answer.id, 'correct', maxPoints)}
                      >
                        正解
                      </Button>
                      <Button
                        color="success"
                        onClick={() => handleOpenPartial(answer.id)}
                      >
                        部分点
                      </Button>
                      <Button
                        color="error"
                        onClick={() => onJudge(answer.id, 'incorrect', 0)}
                      >
                        不正解
                      </Button>
                      <Button
                        color="secondary"
                        onClick={() => onJudge(answer.id, 'dobon', 0)}
                      >
                        ドボン
                      </Button>
                    </ButtonGroup>
                    <Button
                      size="small"
                      color="error"
                      onClick={() => onDelete(answer.id)}
                    >
                      削除
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      <Dialog
        open={partialTargetId !== null}
        onClose={() => setPartialTargetId(null)}
        fullWidth
      >
        <DialogTitle>部分点を入力</DialogTitle>
        <DialogContent>
          <TextField
            label="獲得点数"
            type="number"
            fullWidth
            margin="normal"
            value={partialPoints}
            inputProps={{ min: 1, max: maxPoints }}
            onChange={(e) => setPartialPoints(Number(e.target.value))}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPartialTargetId(null)}>キャンセル</Button>
          <Button variant="contained" onClick={handleSubmitPartial}>
            採点
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
