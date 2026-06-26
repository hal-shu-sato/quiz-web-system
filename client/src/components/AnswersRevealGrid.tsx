'use client';

import {
  Box,
  Container,
  Grid,
  ImageListItem,
  ImageListItemBar,
  Typography,
} from '@mui/material';

import AnswerDisplayCanvas from '@/components/AnswerDisplayCanvas';
import { toAbsoluteFileUrl } from '@/lib/fileUrl';

import type { AnswerDisplayMode } from '@/lib/answerDisplay';

type RevealAnswer = {
  id: string;
  participant_name: string;
  answer_text?: string;
  answer_image_url?: string;
  judgment_result: 'pending' | 'correct' | 'partial' | 'incorrect' | 'dobon';
  awarded_points: number;
};

function getDisplayMode(
  showAnswers: boolean,
  showJudges: boolean,
): AnswerDisplayMode {
  if (showJudges) {
    return 'judged';
  }

  if (showAnswers) {
    return 'original';
  }

  return 'hidden';
}

export default function AnswersRevealGrid({
  answers,
  showAnswers = false,
  showJudges = false,
  fullScreen = false,
  emptyMessage = 'まだ回答がありません',
}: {
  answers: RevealAnswer[];
  showAnswers?: boolean;
  showJudges?: boolean;
  fullScreen?: boolean;
  emptyMessage?: string;
}) {
  const displayMode = getDisplayMode(showAnswers, showJudges);

  if (answers.length === 0) {
    return <Typography>{emptyMessage}</Typography>;
  }

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: fullScreen ? '100vh' : undefined,
      }}
    >
      <Container sx={{ my: 2 }}>
        <Grid container spacing={2} justifyContent="center">
          {answers.map((answer) => {
            const imageUrl =
              'answer_image_url' in answer && answer.answer_image_url
                ? toAbsoluteFileUrl(answer.answer_image_url)
                : '';

            return (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={answer.id}>
                <ImageListItem>
                  {imageUrl ? (
                    <AnswerDisplayCanvas
                      imageUrl={imageUrl}
                      mode={displayMode}
                      judgment={answer.judgment_result}
                    />
                  ) : (
                    <Box
                      sx={{
                        width: '100%',
                        aspectRatio: '640 / 360',
                        bgcolor:
                          displayMode === 'hidden' ? '#0000bf' : '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        px: 2,
                      }}
                    >
                      <Typography variant="body1" align="center">
                        {'answer_text' in answer ? answer.answer_text : '—'}
                      </Typography>
                    </Box>
                  )}
                  <ImageListItemBar
                    title={answer.participant_name}
                    subtitle={
                      showJudges
                        ? `${answer.awarded_points}ポイント`
                        : undefined
                    }
                    sx={{
                      background: 'rgba(0, 0, 0, 0.25)',
                      textAlign: 'center',
                    }}
                  />
                </ImageListItem>
              </Grid>
            );
          })}
        </Grid>
      </Container>
    </Box>
  );
}
